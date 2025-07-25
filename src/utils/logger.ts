import winston, { Logger, LoggerOptions, transports, format } from 'winston'
// import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'
import { app } from '../config'

const { combine, timestamp, prettyPrint, colorize, errors, printf } = format

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] `
  msg += `${message} `
  
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata)
  }
  
  return msg
})

// Base format for all transports
const baseFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  logFormat
)

// Format for console output
const consoleFormat = combine(
  baseFormat,
  colorize({ all: true })
)

// Format for file output
const fileFormat = combine(
  baseFormat,
  prettyPrint()
)

// Format for Splunk/DataDog
const splunkFormat = combine(
  baseFormat,
  format.json()
)

const prettyFormat = combine(baseFormat, format.prettyPrint())
// Configure file rotation
// const fileRotateTransport = new DailyRotateFile({
//   filename: path.join('logs', 'application-%DATE%.log'),
//   datePattern: 'YYYY-MM-DD',
//   maxSize: '20m',
//   maxFiles: '14d',
//   format: fileFormat
// })

// // Configure error file rotation
// const errorFileRotateTransport = new DailyRotateFile({
//   filename: path.join('logs', 'error-%DATE%.log'),
//   datePattern: 'YYYY-MM-DD',
//   maxSize: '20m',
//   maxFiles: '14d',
//   level: 'error',
//   format: fileFormat
// })

// Configure HTTP transport for DataDog
const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/api/v2/logs?dd-api-key=82eb26784beb4ae950a82a5a856646c6&source=nodejs&service=eos-ms-orders-service',
  ssl: false,
  format: splunkFormat
}

const loggerOptions: LoggerOptions = {
  defaultMeta: { 
    service: 'eos-ms-bigquery-service', 
    ddsource: 'nodejs',
    environment: app.env
  },
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.PRETTY_LOGS ? prettyFormat : splunkFormat,
  transports: [
    // Console transport
    new transports.Console({
      format: consoleFormat,
      handleExceptions: true
    }),
    // File rotation transport
    // fileRotateTransport,
    // // Error file rotation transport
    // errorFileRotateTransport,
    // DataDog transport (uncomment to enable)
    // new transports.Http(httpTransportOptions)
  ],
  exceptionHandlers: [
    new transports.Console({ format: consoleFormat }),
    //errorFileRotateTransport
  ]
}

// Create logger instance
const logger: Logger = winston.createLogger(loggerOptions)

// Create a stream for Morgan (HTTP request logging)
class LoggerStream {
  public write(text: string) {
    logger.info(text.trim())
  }
}

const loggerStream = new LoggerStream()

export { logger, loggerStream }
