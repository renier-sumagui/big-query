import { TransactionModel } from "./transactionModel";

const getTransactions = async (data: any) => {
    try {
        let limit = 0;
        let offset = 0;
        let sort = {};

        if (data.sort) {
            sort = data.sort;
            delete data.sort;
        }

        if (data.status === undefined) {
            data.status = 1;
        }

        let result = await TransactionModel.find(data)
            .sort(sort)
            .limit(limit)
            .skip(offset)

        return result;
    } catch (error: any) {
        console.error("Error getTransactions:", error);
        console.log("Error stack getTransactions:", error.stack);
        return [];
    }
};

const handleError = (err: any) => {
    return new Promise((resolve, reject) => {
        reject(err);
    });
};


export { getTransactions };