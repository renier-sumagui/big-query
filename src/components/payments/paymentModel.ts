import mongoose, { Schema } from 'mongoose';
import { payments } from '../../services/mongo';

const ObjectId = mongoose.Schema.Types.ObjectId;

// STATUS
const SOFT_DELETED = 0
const ACTIVE = 1
const INACTIVE = 2
const NOT_SYNC = 0
const LOCAL_SYNC = 1
const CLOUD_SYNC = 2

// Transaction Status
const INITIATED = 1
const IN_PROCESS = 2
const APPROVED = 3
const PARTIAL_REFUND = 4
const REFUNDED = 5
const VOIDED = 6

// CURRENCY
const DOLLAR = 1;

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
};

const Payment = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        isFirebase: { type: Boolean, default: false },
        fromDevice: { type: Boolean, default: false },
        fromMongo: { type: Boolean, default: true },
        paymentCurrency: {
            type: Number,
            min: DOLLAR,
            max: DOLLAR,
            default: DOLLAR,
            validate: validator,
        },
        paymentAmount: { type: Number, default: 0 },
        paymentTipAmount: { type: Number, default: 0 },
        paymentIntentId: {
            type: String,
        },
        paymentProcessor: {
            type: String,
        },
        payId: {
            type: String,
            default: 0,
        },
        paymentStatus: {
            type: Number,
            min: INITIATED,
            max: 6,
            default: INITIATED,
            validate: validator,
        },
        checksum: { type: String, default: "" },
        orderId: { type: String, default: "", required: true },
        transactionIds: [{ type: String, default: "" }],
        oldTransactionIds: [{ type: String }],
        deviceId: { type: String, default: "" },
        merchantId: { type: String, required: true },
        storeId: { type: String, required: true },
        createdEmployeeId: { type: String, default: "" },
        updatedEmployeeId: { type: String, default: "" },
        createdAt: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000),
        },
        updatedAt: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000),
        },
        _processed_at: { type: Number, default: 0 },
        captured: { type: Boolean, default: false },
        isRefundNotificationSent: { type: Boolean, default: false },
        isPaidDiscountNotificationSent: { type: Boolean, default: false },
        isManual: {
            type: Number,
            min: 0,
            max: 2,
            default: 0,
        },
        status: {
            type: Number,
            min: SOFT_DELETED,
            max: INACTIVE,
            default: ACTIVE,
            validate: validator,
        },
        date: { type: String },
        isSync: {
            type: Number,
            min: NOT_SYNC,
            max: CLOUD_SYNC,
            default: CLOUD_SYNC,
            validate: validator,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

Payment.set('toJSON', {
    transform(doc, ret, options) {
        ret.paymentId = ret._id
        delete ret._id
        delete ret.__v
        delete ret.isSync
    }
})

const PaymentModel = payments.connection.model('Payment', Payment);

export { PaymentModel };