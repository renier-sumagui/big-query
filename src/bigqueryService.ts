import Express, { Application } from "express";
import helmet from "helmet";
import { orderRoutes } from "./components/orders";
import { employeeRoutes } from "./components/employees";

import { logger } from "./utils/logger";

import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares/errorHandler";

import * as mongo from "./services";

import { app as appConfig } from "./config";
const Sentry = require("@sentry/node");

class BigQueryService {
    public app: Application;

    constructor() {
        this.initMongo();
        this.app = Express();
        this.init();
    }

    private init() {
        this.initMongo();
        this.initMiddlewares();
        this.initRoutes();
        // Initialize Sentry only in production
        // --------------- CAUSING BUGS, COMMENTED OUT FOR NOW --------------- 
        // if (appConfig.env === "prod") {
        //     Sentry.init({
        //         dsn: 'https://1520aa670c0c488387dc5648d390685d@o4505058481274880.ingest.sentry.io/4505069474349056',
        //         environment: appConfig.env,
        //         integrations: [
        //           // enable HTTP calls tracing
        //           new Sentry.Integrations.Http({ tracing: true }),
        //           // enable Express.js middleware tracing
        //           new Sentry.Integrations.Express({ app: this.app })
        //         ]
        //     });
        // }
    }

    private initMiddlewares() {
        this.app.use(Express.json({ limit: "10mb" }));
        this.app.use(helmet());

        // Simple request time logger
        this.app.use((req, res, next) => {
            const { rawHeaders, method, originalUrl, body} = req;
            const protocol = req.protocol;
            const host = req.hostname;
            const url = req.originalUrl;
            const port = appConfig.port;
            const fullUrl = `${protocol}://${host}:${port}${url}`;
            //logger.info(toJSON(req))
            // This function call tells that more processing is
            // required for the current request and is in the next middleware
            logger.info(JSON.stringify({
                type: "API-Request",
                url: url,
                method: method,
                originalUrl: fullUrl,
                body: body
            }));

            next();
        });

        // --------------- CAUSING BUGS, COMMENTED OUT FOR NOW --------------- 
        // // The request handler must be the first middleware on the app
        // this.app.use(Sentry.Handlers.requestHandler);

        // // TracingHandler creates a trace for every incoming request
        // this.app.use(Sentry.Handlers.tracingHandler());

        // // The error handler must be registered before any other error middleware and after all controllers
        // this.app.use(Sentry.Handlers.errorHandler());
    }

    private initRoutes() {
        this.app.use(orderRoutes);
        this.app.use(employeeRoutes);

        this.app.use(notFoundMiddleware);
        this.app.use(errorHandlerMiddleware);
    }

    private async initMongo() {
        mongo.connectAll();
    }
}

export default new BigQueryService().app;