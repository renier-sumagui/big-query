import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";
import ResponseClass from "../../middlewares/responseClass";
import * as requestParams from "./orderParams";
import { logger } from "../../utils/logger";
import * as controllers from "./orderController";
import { DateTime } from "luxon";
import { BigQueryService } from "../../services";

const bulkUploadOrders = async (req: Request, res: Response, next: NextFunction) => {
    //assign error language when handler is initialized so it applicable for controller and model by error class
    ResponseClass.lang = req.body.payload
        ? req.body.payload.lang
        : req.query.lang
            ? req.query.lang
            : 'en';

    try {
        await requestParams.uploadOrders.validate(req.body);
    } catch (err: any) {
        return next(boom.badRequest((ResponseClass.getMessage("ECORD_101", 'Missing required fields or Invalid input given.'))));
    }

    try {
        const allOrders = await controllers.collectAllOrdersForBulkUpload();

        // await bigQuery.uploadToBigQuery({ 
        //     dataset,
        //     table,
        //     rows: allOrders.slice(3, 6),
        // });


        // TODO: Remove route and handler after testing
        res.send({
            message: "Successfully uploaded orders to BigQuery",
            data: {
                allOrders
            }
        });
    } catch (err: any) {
        logger.info({
            type: "uploadOrders error encountered",
            body: err,
        });

        if (err[0]) {
            return next(boom.badImplementation(err[0].message));
        }

        return next(boom.badImplementation)
    }
};

export { bulkUploadOrders };