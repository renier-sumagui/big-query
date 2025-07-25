import { Router } from "express";
import * as handlers from "./employeeHandler";
import ResponseClass from "../../middlewares/responseClass";

class OrderRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get("/bigquery/employee/bulk", handlers.bulkUploadEmployees);
    }
}

export default new OrderRoutes().router;