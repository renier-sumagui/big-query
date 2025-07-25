import { StoreModel } from "../storeModel";

class StoreMongoRepository {
    async getAllStoresWithIntegrations(): Promise<any[]> {
        let offset = 0;
        let limit = 0;

        let result: any;

        const projection = {
            storeName: 1,
            storeId: 1,
            createdAt: 1,
            integrations: 1,
            merchantId: 1,
            storeTimezone: 1,
        };

        result = await StoreModel.find({ "integrations.0": { $exists: true } }, projection)
            .limit(limit)
            .skip(offset)
            .sort({ storeName: 1 });

        return result;
    }
}

export const StoreRepository = new StoreMongoRepository();