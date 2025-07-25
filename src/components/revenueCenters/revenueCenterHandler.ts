import { logger } from "../../utils/logger";
import * as controllers from "./revenueCenterController";

const getRevenueCentersByIds = async (revenueCenterIds: string, storeId?: string) => {
    try {
        const query: any = {};

        if (revenueCenterIds) {
            query._id = { $in: revenueCenterIds.split(',') };
        }

        if (storeId) {
            query.storeId = storeId;
        }

        const response: any = await controllers.getRevenueCenters(query);

        return response;
    } catch (err: any) {
        console.error("Error in getRevenueCentersByIds:", err);
        console.error("Error stack:", err.stack);

        throw new Error(err as string);
    }
}

export { getRevenueCentersByIds };