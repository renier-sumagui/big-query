import { RevenueCenterModel } from "./revenueCenterModel";

const getRevenueCenters = async (data: any) => {
    try {
        let limit = 0;
        let offset = 0;

        let result: any;

        result = await RevenueCenterModel.find(data)
            .limit(limit)
            .skip(offset)
            .sort({ revenueCenterName: 1});
            
        return result;
    } catch (err: any) {
        return handleError(err);
    }
}

const handleError = (err: any) => {
    return new Promise((resolve, reject) => {
        reject(err)
    })
}

export { getRevenueCenters };