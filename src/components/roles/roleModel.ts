import mongoose, { Schema } from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
import { roles } from "../../services/mongo";

//STATUS
const SOFT_DELETED = 0;
const ACTIVE = 1;
const INACTIVE = 2;
const NOT_SYNC = 0;
const LOCAL_SYNC = 1;
const CLOUD_SYNC = 2;

// PermissionsTypes:
export const NO = 0;
export const READ = 1;
export const WRITE = 2;
export const ALL = 4;

const PARENTS = [
    "Menu",
    "Payments",
    "Restaurant",
    "Customer",
    "Feedback",
    "Profile",
    "Account",
    "Employee",
    "Reports",
    "Special",
    "Advance",
    "Master",
];

const validator: any = {
    validator: Number.isInteger,
    message: "{VALUE} is not an integer value",
};

/**
 * @description ⚠️ IMPORTANT: INTERDEPENDENCIES ⚠️
 *
 * Whenever you add mandatory entities or fields,
 * please ensure to update the following functions
 * for data consistency:
 *
 * @function rolesController -> getRolesStorePreset
 *
 * @abstract This schema defines...
 */
const Role = new Schema({
    _id: { type: ObjectId, auto: true },
    roleName: { type: String, maxlength: 50, required: true },
    departmentId: { type: String, default: null },
    permissions: [
        {
            _id: false,
            permissionName: { type: String, required: true },
            permissionValue: {
                type: Number,
                min: NO,
                max: ALL,
                default: NO,
                required: true,
                validate: {
                    validator: Number.isInteger,
                    message: "{VALUE} is not an integer value",
                },
            },
            // ermissionParentName:{type: String,enum:PARENTS,default:""},
        },
    ],
    sevenshiftId: { type: Number, required: false },
    isManager: { type: Boolean, default: false },
    isInternal: { type: Boolean, default: false },
    fullAccess: { type: Boolean, default: false },
    merchantId: { type: String, required: true },
    storeId: { type: String, required: true },
    createdEmployeeId: { type: String, default: "" },
    updatedEmployeeId: { type: String, default: "" },
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
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
});

Role.methods.toJSON = function () {
    const role = this
    const roleObject: any = role.toObject()
    roleObject.roleId = roleObject._id
    delete roleObject._id
    delete roleObject.__v
    delete roleObject.isSync
    return roleObject
}

const RoleModel = roles.connection.model("Role", Role);

export { RoleModel };