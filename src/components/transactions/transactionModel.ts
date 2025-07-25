import mongoose, { Schema } from "mongoose";
import { decrypt, encrypt } from "../../utils/encryption";
import { payments } from "../../services/mongo";

const ObjectId = mongoose.Schema.Types.ObjectId;

// TODO:ADD TYPES/STATUS/CURRENCY
const SOFT_DELETED = 0;
const ACTIVE = 1;
const INACTIVE = 2;
const NOT_SYNC = 0;
const LOCAL_SYNC = 1;
const CLOUD_SYNC = 2;

// TransactionTypeId
export const CASH = 1;
const CHEQUE = 2;
const BRUINCARD = 3;
const GIVEX = 4;
const UCLA_BLOOD = 5;
const UCLA_CAREER = 6;
const UCLA_DORM = 7;
const UCLA_EMP = 8;
const UCLA_MEAL = 9;
const UCLA_PARENT = 10;
const UCLA_EVENT = 11;
const GCPROMOTION = 12;
const GRUBHUB = 13;
// const POSTMATES = 14
const UBER_EATS = 14;
const TAKEOUTTECH = 15;
export const CARDCONNECT = 16;
const DATACAP = 17;
const CREDITCALL = 18;
const UNO = 19;
const SQUARE = 20;

// New values
const AMEX = 21; // Amex
const DISCOVER = 22; // Discover
const MASTERCARD = 23; // Mastercard
const VISA = 24; // Visa
const UNKNOWN = 25; // Unknown

const DOORDASH = 26;
const BLITZZFUL = 27;

export const STRIPE = 28;
const CLOVER = 29;
const POYNT = 30;
const ECARD = 31;
export const ONLINE_ORDER = 32;
export const VOUCHERIFY = 33;
const UBEREATS = 34;
const EXTERNAL_CC = 35;
const OTTER = 36;
const URBANPIPER = 39;

export const TOTALPAY = 37;
export const ADYEN = 38;

// Transaction Status
const APROVED = 1;
const PARTIAL_REFUND = 2;
const REFUNDED = 3;
const REFUND = 4;
const DEPOSITED = 5;
const VOIDED = 6;
const VOID = 7;

const NONE = 0;
const TIP_IN_PROGRESS = 1;
const REFUND_IN_PROGRESS = 2;
const CLOSING_IN_PROGRESS = 3;

const validator: any = {
    validator: Number.isInteger,
    message: "{VALUE} is not an integer value",
};

const Transaction = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        isFirebase: { type: Boolean, default: false },
        fromDevice: { type: Boolean, default: false },
        fromMongo: { type: Boolean, default: true },
        transactionTypeId: {
            type: Number,
            default: CASH,
            validate: validator,
        },
        transactionStatus: {
            type: Number,
            min: APROVED,
            max: 7,
            default: APROVED,
            validate: validator,
        },
        transactionAmount: { type: Number, default: 0 },
        transactionTipAmount: { type: Number, default: 0 },
        transactionSurcharge: { type: Number, default: 0 },
        checksum: { type: String, default: "" },
        signatures: {
            type: Array,
            default: [],
        },
        extraFields: {
            type: Schema.Types.Mixed,
            set: encryptBody,
        },
        inProgressStatus: {
            type: Number,
            min: NONE,
            max: CLOSING_IN_PROGRESS,
            default: NONE,
            validate: validator,
        },
        eosCommission: { type: Number, default: 0 },
        merchantId: { type: String, required: true },
        tranxId: { type: String, default: 0 },
        storeId: { type: String, required: true },
        deviceId: { type: String, default: "" },
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

function decryptBody(extraFields) {
    const emptyExtraFields: any = {};
    for (let key in extraFields) {
        emptyExtraFields[key] = decrypt(extraFields[key]);
    }
    return emptyExtraFields;
}

function encryptBody(extraFields) {
    const emptyExtraFields: any = {};

    for (let key in extraFields) {
        if (extraFields[key] !== null) {
            emptyExtraFields[key] = encrypt(extraFields[key]);
        }
        //emptyExtraFields[key] = encrypt(extraFields[key])
    }
    return emptyExtraFields;
}

Transaction.set("toJSON", {
    transform(doc, ret, options) {
        ret.transactionId = ret._id;
        ret.extraFields = decryptBody(ret.extraFields);

        delete ret._id;
        delete ret.__v;
        delete ret.isSync;
    },
});

Transaction.set("toObject", {
    transform(doc, ret, options) {
        ret.extraFields = decryptBody(ret.extraFields);
    },
});

const TransactionModel = payments.connection.model('Transaction', Transaction);

export { TransactionModel };