import * as controllers from "./transactionsController";

const getTransactionsByIds = async (params: any) => {
    try {
        const query: any = {};

        if (params.transactionIds !== "" && params.transactionIds != null) {
            if (typeof params.transactionIds == 'object')
                query._id = { $in: params.transactionIds }
            else query._id = { $in: params.transactionIds.split(',') }
        }

        return await controllers.getTransactions(query);
    } catch (err: any) {
        console.error("Error getTransactionsByIds:", err);
        console.log("Error stack getTransactionsByIds:", err.stack);
        return [];
    }
};

export { getTransactionsByIds };