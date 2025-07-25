import * as controllers from "./paymentController";

const  getPaymentsByOrderIds = async (params: any) => {
    try {
        const query: any = {};

        // Early return if no orderIds or empty string
        if (!params.orderIds || params.orderIds.trim() === '') {
            return [];
        }

        // Split and filter out empty strings
        const orderIdArray = params.orderIds.split(',').filter(id => id.trim() !== '');
        
        // If no valid order IDs after filtering, return empty array
        if (orderIdArray.length === 0) {
            return [];
        }
        
        query.orderId = { $in: orderIdArray };

        if (params.paymentStatusIds) {
            let ids: number[] = [];

            params.paymentStatusIds.split(",").forEach(value => {
                ids.push(value);
            });

            query.paymentStatus = { $in: ids };
        }

        const response: any = await controllers.getPayments(query);

        return response;
    } catch (err: any) {
        console.error("Error in getPaymentsByOrderIds:", err);
        console.error("Error stack:", err.stack);

        throw new Error(err as string);
    }
};

export { getPaymentsByOrderIds };