import schema from "schm";

export const uploadOrders = schema({
    storeId: {
        type: String,
        required: true,
    },
    merchantId: {
        type: String,
        required: true,
    },
    startDate: {
        type: Number
    },
    endDate: {
        type: Number
    }
});