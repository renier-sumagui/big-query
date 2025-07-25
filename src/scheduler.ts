import cron from "node-cron";
import { logger } from "./utils/logger";
import { BigQueryService } from "./services";
import * as ordersController from "./components/orders/orderController";
import * as employeesController from "./components/employees/employeeController";
import dotenv from "dotenv";
dotenv.config();

const bigQueryService = new BigQueryService();
const dataset = process.env.BIGQUERY_DATASET || "prod_hero_dataset";
const ordersTable = process.env.ORDERS_TABLE || "orders";
const employeesTable = process.env.EMPLOYEES_TABLE || "employees";

// Runs every midnight
cron.schedule('0 0 * * *', async () => {
    console.log("Running daily BigQuery upload job...");
    // Get all orders and upload to BigQuery
    try {
        const result = await ordersController.collectAllOrdersForBulkUpload();

        console.log("result:", result);

    } catch (err) {
        logger.error("Failed to upload orders to BigQuery:", err);
    }

    // Get all employees and upload to BigQuery
    // try {
    //     const employees = await employeesController.collectAllEmployeesForBulkUpload();

    //     if (employees.length > 0) {
    //         // TODO: Uncomment codes below after testing
    //         // bigQueryService.uploadToBigQuery({ 
    //         //     dataset,
    //         //     rows: employees,
    //         //     table: employeesTable
    //         // });
    //     }

    //     logger.info("Successfully uploaded employees to BigQuery");
    // } catch (err) {
    //     logger.error("Failed to upload employees to BigQuery:", err);
    // }

    // Get all payments and upload to BigQuery
}); 