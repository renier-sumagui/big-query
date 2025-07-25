import mongoose, { Schema } from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
import { merchants } from '../../services/mongo';

export enum ZapierType {
    newOrder = 1,
    cancelOrder = 2,
    createEmployee = 3
}

export enum ZapierName {
    Gmail = 1,
    Slack = 2,
    Hotmail = 3,
    Discord = 4
}

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
}

// SYNCSTATUS
const NOT_SYNC = 0
const LOCAL_SYNC = 1
const CLOUD_SYNC = 2

// status
const SOFT_DELETED = 0
const ACTIVE = 1
const INACTIVE = 2
const UNVERIFIED = 3

const Store: any = new Schema({
    _id: { type: ObjectId, auto: true },
    appId: { type: String, required: true, default: '65c0d7c8339ad6658470cf34' },
    storeName: { type: String, maxlength: 50, required: true },
    storeCountry: { type: String, default: '' },
    storeState: { type: String, default: '' },
    storeCity: { type: String, default: '' },
    storeAddress1: { type: String, default: '' },
    storeAddress2: { type: String, default: '' },
    storeZipcode: { type: String, default: '' },
    storeLogo: { type: String, default: '' },
    storeLatitude: { type: Number, default: 0 },
    storeLongitude: { type: Number, default: 0 },

    storeType: { type: String, default: 'Restaurant System' },
    storeDescription: { type: String, default: '' },
    storeEmail: { type: String, default: '' },
    storeWebpage: { type: String, default: '' },
    storeMobile: { type: String, default: '' },
    storePhoneCode: { type: String, default: '' },
    storeISOCode: { type: String, default: '' },
    storeNumber: { type: String, default: '' },
    storeTimezone: { type: String, default: 'America/Los_Angeles', required: true },
    storeFrontMapURL: { type: String, default: '' },
    storeFrontCountry: { type: String, default: '' },
    storeFrontState: { type: String, default: '' },
    storeFrontCity: { type: String, default: '' },
    storeFrontAddress1: { type: String, default: '' },
    storeFrontAddress2: { type: String, default: '' },
    storeFrontZipcode: { type: String, default: '' },
    storeFrontName: { type: String, maxlength: 50, default: '' },
    storeFrontLogo: { type: String, default: '' },
    storeFrontTheme: { type: String, default: '#E91E63' },
    kitchenHub: {
        storeId: { type: String, default: '' },
        locationId: { type: String, default: '' }
    },
    storeFrontBotton: {
        width: { type: Number, default: 250 },
        height: { type: Number, default: 50 },
        backgroundColor: { type: String, default: '#E91E63' },
        fontColor: { type: String, default: '#FFFFFF' },
        borderRadius: { type: Number, default: 0 },
        buttonSize: { type: String, default: 'small' },
        buttonType: { type: String, default: 'predesign' },
        fontWeight: { type: Number, default: 500 },
        fontSize: { type: Number, default: 20 },
        text: { type: String, default: 'Go to orderOS' }
    },
    storeFrontNavbarLogo: { type: String, default: '' },
    storeFrontQRLogo: { type: String, default: '' },
    storeFrontRestaurantHeroPhoto: { type: String, default: '' },
    storeFrontMobile: { type: String, default: '' },
    storeFrontPhoneCode: { type: String, default: '' },
    storeFrontCountryCode: { type: String, default: '' },
    storeFrontDescription: { type: String, default: '' },
    storeFrontDomain: { type: String, default: '' },
    storeFrontSubdomain: {
        type: String,
        default: null
    },
    deliveryServices: [{ type: String, default: '' }],
    otterStoreId: { type: String, default: '' },
    urbanpiperStoreId: { type: String, default: '' },
    dialogFlowAgentId: { type: String, default: '' },
    QRDesign: {
        restaurantLogo: { type: String, default: '' },
        restaurantName: { type: String, default: '' },
        tableNumbers: { type: String, default: '' },
        welcomeMessage: { type: String, default: '' },
        themeColor: { type: String, default: '' }
    },
    allowSurcharge: { type: Boolean, default: false },
    allowQSRSurcharge: { type: Boolean, default: false },
    surchargeQSRPercent: { type: Number, default: 0 },
    surchargeSetting: {
        monday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        tuesday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        wednesday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        thursday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        friday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        saturday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        },
        sunday: {
            allow: { type: Boolean, default: false },
            timeFrames: [{ startTime: Number, endTime: Number, amount: Number }]
        }
    },
    smallCartSurchargeSetting: {
        allow: { type: Boolean, default: false },
        minimumOrderAmount: { type: Number, default: 0 },
        surchargeAmount: { type: Number, default: 0 }
    },
    hideFireButton: { type: Boolean, default: false },
    settings: [{ type: String, default: '' }],
    mainStore: { type: Boolean, default: false },
    hideSeatSelector: { type: Boolean, default: false },
    qrPrinting: { type: Boolean, default: false },
    qrOnCfd: { type: Boolean, default: true },
    autoCloseCFD: { type: Boolean, default: true },
    oloEnabled: { type: Boolean, default: false },
    integrations: [],
    sevenshiftId: { type: Number, default: 0 },
    zapierList: [
        {
            _id: false,
            type: {
                type: Number,
                min: ZapierType.newOrder,
                max: ZapierType.createEmployee
            },
            name: [
                {
                    type: Number,
                    min: ZapierName.Gmail,
                    max: ZapierName.Discord
                }
            ],
            url: { type: String, default: '' }
        }
    ],
    isTraineeSetup: { type: Number, default: 0 },
    merchantId: { type: String, required: true, immutable: true },
    sourceUniqueId: { type: String, default: null },
    buyerGuid: { type: String, default: '' },
    holdTable: { type: Number, default: 0 },
    createdEmployeeId: { type: String, default: '' },
    updatedEmployeeId: { type: String, default: '' },
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    tempDisableOnlineOrder: { type: Number, default: 0 },
    isActive: {
        type: Number,
        min: 1,
        max: 2,
        default: 1,
        validate: validator
    },
    status: {
        type: Number,
        min: SOFT_DELETED,
        max: INACTIVE,
        default: ACTIVE,
        validate: validator
    },
    isSync: {
        type: Number,
        min: NOT_SYNC,
        max: CLOUD_SYNC,
        default: CLOUD_SYNC,
        validate: validator
    }
});

Store.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.storeId = ret._id
        delete ret._id
        delete ret.__v
        delete ret.isSync
    }
})

const StoreModel = merchants.connection.model("Store", Store);

export { StoreModel };