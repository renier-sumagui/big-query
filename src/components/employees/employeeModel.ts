import mongoose, { Query, Schema } from 'mongoose'
import { EmployeeStoreSchema } from './employeeStoreSchema'
import { users } from '../../services';

const ObjectId = mongoose.Schema.Types.ObjectId

// SYNCSTATUS
const NOT_SYNC = 0
const LOCAL_SYNC = 1
const CLOUD_SYNC = 2

// Pay type
const HOURLY = 0
const SALARY = 1
const JOB = 2

// 2FA Types
const NO_2FA = 0
const SMS = 1
const MOBILE_APP = 2

// status
const SOFT_DELETED = 0
const ACTIVE = 1
const INACTIVE = 2
const UNVERIFIED = 3

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
};

const Employee: any = new Schema({
    _id: { type: ObjectId, auto: true },
    employeeFirstName: { type: String, maxlength: 50, required: true },
    quickBookId: { type: String, default: "" },
    employeeMiddleName: { type: String, maxlength: 50, default: "" },
    employeeLastName: { type: String, maxlength: 50, default: "" },
    employeeFullName: { type: String, maxlength: 50, default: "" },
    employeeEmail: { type: String, default: "" },
    employeeMobile: { type: String, default: "" },
    employeePhoneCode: { type: String, default: "" },
    employeeImage: { type: String, default: "" },
    employeePin: { type: String, default: "" },
    employeeCountry: { type: String, default: "" },
    employeeState: { type: String, default: "" },
    employeeCity: { type: String, default: "" },
    employeeAddress1: { type: String, default: "" },
    employeeAddress2: { type: String, default: "" },
    employeeZipcode: { type: String, default: "" },
    employeeDOB: { type: String, default: "" },
    employeeLanguage: { type: String, default: "en" },
    employeeJoiningDate: { type: String, default: null },
    employeePayrollType: { type: Number, default: null },
    employeePayrollId: { type: String, default: null },
    employeePhoto: { type: String, default: null },
    employeeColor: { type: String, default: "#ed2890" },
    employeeADPId: { type: String, default: "" },
    employeeBaseRate: { type: Number, default: 0.0 },
    employeeOvertimeRate: { type: Number, default: 0.0 },
    employeeDoubleRate: { type: Number, default: 0.0 },
    employeeMaxHours: { type: Number, default: 0 },
    employeeMaxHoursWeekly: { type: Number, default: 0 },
    employeedoubleTimeMaxHoursWeekly: { type: Number, default: 0 },
    employeedoubleTimeMaxHours: { type: Number, default: 0 },
    employeeSalary: { type: Number, default: 0 },
    employeeCustomId: { type: String, default: "" },
    revenueCenters: [{ type: String, default: "" }],
    employeePaytype: {
        type: Number,
        min: HOURLY,
        max: JOB,
        default: HOURLY,
        validate: validator,
    },
    overTimeAlert: { type: Boolean, default: false },
    overrideJobType: { type: Boolean, default: false },
    autoBreak: { type: Boolean, default: false },
    breakSettings: [
        {
            _id: false,
            Name: { type: String, default: "" },

            afterWorkingHours: { type: String, default: "" },
            breakInMin: { type: String, default: "" },
        },
    ],
    autoClockOut: { type: Boolean, default: false },
    clockOutSettings: [
        {
            _id: false,
            Name: { type: String, default: "" },

            afterWorkingHours: { type: String, default: "" },
            breakInMin: { type: String, default: "" },
        },
    ],
    reportSubscription: {
        gross: { type: Boolean, default: false },
        shift: { type: Boolean, default: false },
        detailed: { type: Boolean, default: false },
        refunds: { type: Boolean, default: false },
        today: { type: Boolean, default: false },
        daily: { type: Boolean, default: false },
        payroll: { type: Boolean, default: false },
        discounts: { type: Boolean, default: false },
        cashouts: { type: Boolean, default: false },
    },
    profiles: [typeof EmployeeStoreSchema],
    employeeJobtypes: [{ type: String, default: "" }],
    employeeDepartmentId: { type: String, default: "" },
    employeeRoleId: { type: String, default: "", required: true },
    isUser: { type: Boolean, default: false },
    canOpenStore: { type: Boolean, default: false },
    breakDurationEnforcementEnabled: { type: Boolean, default: false },
    allowManagerOverrideEnabled: { type: Boolean, default: true },
    forceBreakForEnabled: { type: Boolean, default: false },
    forceBreakFor: { type: Number, default: 0 },
    promptForBreakAfterEnabled: { type: Boolean, default: false },
    promptForBreakAfter: { type: Number, default: 0 },
    forceBreakAfterEnabled: { type: Boolean, default: false },
    forceBreakAfter: { type: Number, default: 0 },
    allowUseWithoutClockIn: { type: Boolean, default: false },
    isOwner: { type: Boolean, default: false },
    doTutorial: { type: Boolean, default: true },
    sideScroll: { type: Boolean, default: false },
    supportPin: { type: String, default: "" },
    payrollEnabled: { type: Boolean, default: false },
    username: {
        type: String,
        trim: true,
    },
    password: { type: String, required: true },
    mobile: {
        type: String,
        trim: true,
    },

    has2FA: {
        type: Number,
        min: NO_2FA,
        max: MOBILE_APP,
        default: NO_2FA,
    },
    otp: { type: String, default: "" },
    otpExpiration: { type: Number, default: 0 },
    unverifiedUsername: { type: String, default: "" },
    unverifiedMobile: { type: String, default: "" },
    token: { type: String, default: "" },
    longTermToken: { type: String, default: "" },
    otpAttempt: { type: String, default: 0 },
    loginAttempt: { type: String, default: 0 },
    assignedZoneId: { type: String, default: "" },

    gustoIntegration: {
        gustoEmployeeId: { type: Number, default: 0 },
        gustoJobId: { type: Number, default: 0 },
    },

    squareIntegration: {
        teamMemberId: { type: String, default: "" },
    },
    ask2faPermission: { type: Boolean, default: true },
    recoveryCodes: { type: Array, default: [] },
    accessTo2fa: { type: Boolean, default: false },
    authyId: { type: String, default: null },
    authyQR: { type: String, default: null },
    authyQRExpiration: { type: Number, default: 0 },
    updatedSMS2faAt: { type: Number, default: 0 },
    updatedAuthy2faAt: { type: Number, default: 0 },
    merchantId: { type: String, required: true, immutable: true },
    resellerId: { type: String, default: null },
    storeId: { type: String, required: true, immutable: true },
    googleId: { type: String, default: null },
    facebookId: { type: String, default: null },
    appleId: { type: String, default: null },
    microsoftId: { type: String, default: null },
    defaultLanguage: { type: String, default: "en" },
    socialSecurityNumber: { type: String, default: null },
    createdEmployeeId: { type: String, default: "" },
    udatedEmployeeId: { type: String, default: "" },
    referralCode: { type: String, default: "" },
    referredBy: { type: String, default: "" },
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    deletedAt: { type: Number },
    oldEmail: { type: String },
    lastSession: { type: Number },
    employeeJobTypeDetails: { type: Array, default: [] },
    extraFields: {
        type: Schema.Types.Mixed,
        default: {},
    },
    status: {
        type: Number,
        min: SOFT_DELETED,
        max: UNVERIFIED,
        default: UNVERIFIED,
        validate: validator,
    },
    isSync: {
        type: Number,
        min: NOT_SYNC,
        max: CLOUD_SYNC,
        default: CLOUD_SYNC,
        validate: validator,
    },
    sevenshiftId: {
        type: Number,
    },
    sellerAgreement: {
        type: Boolean,
        default: false,
    },
});

Employee.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.employeeId = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.isSync;
        delete ret.password;
    },
});

const EmployeeModel = users.connection.model("Employee", Employee);

export { EmployeeModel };