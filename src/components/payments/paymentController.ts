import mongoose from "mongoose";
import { PaymentModel } from "./paymentModel";

const ObjectId = mongoose.Schema.Types.ObjectId;

enum PaymentProcessorType {
    CardConnect = "CARDCONNECT",
    Stripe = "STRIPE",
    TotalPay = "TOTALPAY",
    Adyen = "ADYEN",
}

interface Payment {
    _id?: string | typeof ObjectId;
    paymentCurrency?: number;
    paymentAmount?: number;
    paymentStatus?: number;
    paymentTipAmount?: number;
    checksum?: string;
    orderId?: string;
    transactionIds?: string[];
    createdEmployeeId?: string;
    updatedEmployeeId?: string;
    paymentIntentId?: string;
    paymentProvider?: string;
    paymentProcessor?: PaymentProcessorType;
    captured?: boolean;
    createdAt?: number;
    updatedAt?: number;
    status?: number;
    merchantId?: string;
    storeId?: string;
    isSYnc?: number;
}

const getPayments = async (data: any): Promise<Payment[]> => {
    try {
        let offset = 0;
        let limit = 0;

        const startDate = data.startDate
        const endDate = data.endDate

        if (data.startDate && data.endDate == undefined) {
            data.createdAt = { $gte: startDate };
            delete data.startDate;
        } else if (data.endDate && data.startDate == undefined) {
            data.createdAt = { $lte: endDate };
            delete data.endDate;
        }
        if (data.startDate && data.endDate) {
            data.createdAt = {
                $gte: startDate,
                $lt: endDate,
            };
            delete data.startDate;
            delete data.endDate;
        }

        if (!data.transactionIds) data.transactionIds = { $exists: true, $ne: [] }

        let dataQuery = JSON.parse(JSON.stringify(data))

        const result: any = await PaymentModel.find(dataQuery)
            .limit(limit)
            .skip(offset)

        return result;
    } catch (error: any) {
        console.log(error);
        throw error;
    }
};

export { getPayments };