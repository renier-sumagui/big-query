import { Router } from "express";
import * as handlers from "./orderHandler";

class OrderRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post("/bigquery/order/bulk", handlers.bulkUploadOrders);
    }
}

export default new OrderRoutes().router;