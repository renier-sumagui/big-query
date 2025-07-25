import { EmployeeModel } from "./employeeModel";
import { StoreRepository } from "../stores/repository/mongo";
import pLimit from "p-limit";
import { getStoreDayRange } from "../../utils/getStoreDayRange";
import { DateTime } from "luxon";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";
import * as rolesHandler from "../roles/rolesHandler";

const getEmployeesByStoreCursor = (data: any) => {
    let parameters: any = {};
    let sort: any = { employeeFirstName: 1 };

    if (data.storeId) parameters.storeId = data.storeId;

    // if (data.startDate && data.endDate == undefined)
    //     parameters.createdAt = { $gte: data.startDate };
    // if (data.endDate && data.startDate == undefined)
    //     parameters.createdAt = { $lte: data.endDate };
    // if (data.endDate && data.startDate)
    //     parameters.createdAt = { $gte: data.startDate, $lte: data.endDate };

    if (data.status == 9) {
        parameters.status = { $gte: 1 }
    }

    return EmployeeModel.find(parameters)
        .sort(sort)
        .cursor();
}

const collectAllEmployeesForBulkUpload = async () => {
    let stores = await StoreRepository.getAllStoresWithIntegrations();

    // TODO: Uncomment the lines below after testing
    // stores = stores.filter(store => {
    //     return store.integrations?.some((integration: any) => 
    //         integration.name === 'LOOKER' && integration.enabled === true
    //     );
    // });

    const BATCH_SIZE = 500;
    const limit = pLimit(10);
    const allEmployees: any = [];

    const processStore = async (store: any) => {
        const { startOfDay, endOfDay } = getStoreDayRange(store.storeTimezone);

        const params = {
            storeId: store._id.toString(),
            status: 9
        };

        const cursor = getEmployeesByStoreCursor(params);
        let batch: any[] = [];

        for await (const employee of cursor) {
            batch.push({
                id: employee._id.toString(),
                data: JSON.stringify(employee),
                reportDate: DateTime.now().setZone(store.storeTimezone).toISO()
            });

            if (batch.length === BATCH_SIZE) {
                allEmployees.push(...batch);
                batch = [];
            }
        }

        if (batch.length > 0) {
            allEmployees.push(...batch);
        }
    };

    await Promise.all(stores.map(store => limit(processStore, store)));

    return allEmployees;
}

const getEmployees = async (data: any) => {
    try {
        let limit: number = 0;
        let offset: number = 0;
        let sort: any = { employeeFirstName: 1};

        if (data.status == 9) {
            data.status = { $gte: 1 };
        }

        return await EmployeeModel.find(data)
            .limit(limit)
            .skip(offset)
            .sort(sort);
    } catch (err) {
        logger.error("Failed to get employees:", err);
        throw new Error(err as string);
    }
}

const handleError = (err: any) => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
}

export { collectAllEmployeesForBulkUpload, getEmployees }