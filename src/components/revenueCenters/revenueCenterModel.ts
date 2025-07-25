import mongoose, { Schema } from 'mongoose'
import { merchants } from '../../services'

const ObjectId = mongoose.Schema.Types.ObjectId

//SYNCSTATUS
const NOT_SYNC = 0
const LOCAL_SYNC = 1
const CLOUD_SYNC = 2

//status
const SOFT_DELETED = 0
const ACTIVE = 1
const INACTIVE = 2
const UNVERIFIED = 3

//ServiceType:
const QUICK_SERVICE = 1
const TABLE_SERVICE = 2

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
}

const RevenueCenter = new Schema({
    _id: { type: ObjectId, auto: true },
    revenueCenterName: { type: String, maxlength: 50, required: true },
    revenueServiceType: {
        type: Number,
        min: QUICK_SERVICE,
        max: TABLE_SERVICE,
        default: QUICK_SERVICE,
        validate: validator
    },
    zoneIds: [{ type: String, default: '' }],
    employeeIds: [{ type: String, default: '' }],
    menus: [{ type: String, default: '' }],
    specialEvents: [{ type: String, default: '' }],

    merchantId: { type: String, required: true },
    storeId: { type: String, required: true },
    sourceUniqueId: { type: String, default: null },
    createdEmployeeId: { type: String, default: '' },
    updatedEmployeeId: { type: String, default: '' },
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
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
})

RevenueCenter.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.revenueCenterId = ret._id
        delete ret._id
        delete ret.__v
        delete ret.isSync
    }
})

const RevenueCenterModel = merchants.connection.model('RevenueCenter', RevenueCenter);

export { RevenueCenterModel };