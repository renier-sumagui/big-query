import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";
import ResponseClass from "../../middlewares/responseClass";
import { logger } from "../../utils/logger";
import * as controllers from "./employeeController";
import { BigQueryService } from "../../services";
import { app } from "../../config";
import mongoose from "mongoose";
import * as rolesHandler from "../roles/rolesHandler";

const bulkUploadEmployees = async (req: Request, res: Response, next: NextFunction) => {
    //assign error language when handler is initialized so it applicable for controller and model by error class
    ResponseClass.lang = req.body?.payload
    ? req.body.payload.lang
    : req.query.lang
        ? req.query.lang
        : 'en';

    try {
        const employees = await controllers.collectAllEmployeesForBulkUpload();

        const bigQuery = new BigQueryService();

        const dataset = app.bigQuery.dataset;
        const table = app.bigQuery.employeesTable;

        await bigQuery.uploadToBigQuery({
            dataset,
            table,
            rows: employees.slice(0, 1)
        });

        res.json({
            message: "Uploaded employees",
            success: 1,
            data: employees
        })
    } catch (err: any) {
        console.log("ERROR", err);
        logger.info({
            type: "uploadOrders error encountered",
            body: err,
        });

        if (err[0]) {
            return next(boom.badImplementation(err[0].message));
        }

        return next(boom.badImplementation)
    }
}

const getEmployeeByIds = async (employeeIds: string, storeId: string) => {
    try {
        const query: any = {
            storeId
        };

        if (employeeIds) {
            query._id = { $in: employeeIds.split(',') };
        }

        const response: any = [];

        const employees: any = await controllers.getEmployees(query);
        
        let roleIds: string = "";
        
        for (let k = 0; k < employees.length; k++) {
            if (!employees[k].employeeRoleId || !mongoose.Types.ObjectId.isValid(employees[k].employeeRoleId)) {
                continue;
            }

            roleIds += employees[k].employeeRoleId;
            if (k < employees.length - 1) roleIds += ",";
        }

        let roles: any = [];
        if (roleIds) {
            try {
                roles = await rolesHandler.getRoleByIds({ roleIds });
            } catch (roleError) {
                console.error("Failed to fetch roles, continuing without role enrichment:", roleError);
                roles = []; // Continue without roles
            }
        }

        for (let j = 0; j < employees.length; j++) {
            let element = employees[j].toJSON()
            for (let i = 0; i < roles.length; i++) {
              if (element.employeeRoleId == roles[i].roleId) {
                element.employeeRoleId = roles[i]
                break
              }
            }
            response.push(element)
        }

        console.log("Final response length:", response.length);
        return response;
    } catch (err: any) {
        console.error("Error in getEmployeeByIds:", err);
        console.error("Error stack:", err.stack);
        // logger.error({
        //     type: "getEmployeeByIds error encountered",
        //     body: err,
        // });

        throw new Error(err as string);
    }
}

export { bulkUploadEmployees, getEmployeeByIds };