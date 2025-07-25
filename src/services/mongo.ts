import mongoose, { ConnectOptions, Connection } from 'mongoose';
import { logger } from '../utils/logger';
import { app } from '../config';

// Set 'strictQuery' to false to suppress the deprecation warning
mongoose.set('strictQuery', false);

// Connection configuration
const CONNECTION_CONFIG: ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
  heartbeatFrequencyMS: 10000,
  w: 'majority' as const,
  wtimeoutMS: 5000
};

// Circuit breaker configuration
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,
  resetTimeout: 30000,
  windowSize: 60000
};

class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private isOpen: boolean = false;
  private windowStart: number = Date.now();

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeout: number,
    private readonly windowSize: number
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen) {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.isOpen = false;
        logger.info('Circuit breaker reset - attempting operation');
      } else {
        throw new Error('Circuit breaker is open - operation blocked');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.isOpen = false;
  }

  private onFailure(): void {
    const now = Date.now();
    
    if (now - this.windowStart > this.windowSize) {
      this.failures = 0;
      this.windowStart = now;
    }

    this.failures++;
    this.lastFailureTime = now;

    if (this.failures >= this.failureThreshold) {
      this.isOpen = true;
      logger.error('Circuit breaker opened due to too many failures');
    }
  }
}

// Helper to create and manage a connection with health check and circuit breaker
function createManagedConnection(uri: string, label: string) {
  const circuitBreaker = new CircuitBreaker(
    CIRCUIT_BREAKER_CONFIG.failureThreshold,
    CIRCUIT_BREAKER_CONFIG.resetTimeout,
    CIRCUIT_BREAKER_CONFIG.windowSize
  );
  let pingInterval: NodeJS.Timeout | null = null;
  const connection = mongoose.createConnection(uri, CONNECTION_CONFIG);

  // Health check ping
  connection.on('connected', () => {
    logger.info(`[${label}] Connected to MongoDB`);
    if (!pingInterval) {
      pingInterval = setInterval(async () => {
        try {
          await connection.db.command({ ping: 1 });
          logger.debug(`[${label}] MongoDB ping successful`);
        } catch (error) {
          logger.error(`[${label}] Failed to ping MongoDB`, error);
          try {
            await connection.close();
            await circuitBreaker.execute(() => connection.openUri(uri, CONNECTION_CONFIG));
            logger.info(`[${label}] Reconnected to MongoDB`);
          } catch (e) {
            logger.error(`[${label}] Error reconnecting to MongoDB`, e);
          }
        }
      }, 10000);
    }
  });

  connection.on('error', error => {
    logger.error(`[${label}] MongoDB connection error`, error);
  });

  connection.on('disconnected', () => {
    logger.info(`[${label}] Disconnected from MongoDB`);
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  });

  connection.on('reconnected', () => {
    logger.info(`[${label}] Reconnected to MongoDB`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      await connection.close();
      logger.info(`[${label}] MongoDB connection closed through app termination`);
    } catch (err) {
      logger.error(`[${label}] Error closing MongoDB connection:`, err);
    }
  });

  // Initial connect wrapped in circuit breaker
  const connect = async () => {
    try {
      await circuitBreaker.execute(() => connection.openUri(uri, CONNECTION_CONFIG));
    } catch (error) {
      logger.error(`[${label}] Error connecting to MongoDB`, error);
      throw error;
    }
  };

  return { connection, connect };
}

const orders = createManagedConnection(app.database.ordersDB, 'orders');
const merchants = createManagedConnection(app.database.merchantsDB, 'merchants');
const users = createManagedConnection(app.database.usersDB, 'users');
const payments = createManagedConnection(app.database.paymentsDB, 'payments');
const roles = createManagedConnection(app.database.rolesDB, 'roles');

const connectAll = async () => {
  await Promise.all([
    orders.connect(),
    merchants.connect(),
    users.connect(),
    payments.connect(),
    roles.connect(),
  ]);
};

export {
  orders,
  merchants,
  users,
  payments,
  roles,
  connectAll
};