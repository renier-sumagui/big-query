import mongoose from "mongoose";

// Pay type
const HOURLY = 0
const SALARY = 1
const JOB = 2


const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
}

const EmployeeStoreSchema = new mongoose.Schema({
    employeeBaseRate: { type: Number, default: 0.0 },
    employeeOvertimeRate: { type: Number, default: 0.0 },
    employeeDoubleRate: { type: Number, default: 0.0 },
    employeeMaxHours: { type: Number, default: 0 },
    employeeMaxHoursWeekly: { type: Number, default: 0 },
    employeedoubleTimeMaxHoursWeekly: { type: Number, default: 0 },
    employeedoubleTimeMaxHours: { type: Number, default: 0 },
    employeeSalary: { type: Number, default: 0 },
    employeePayrollType: { type: Number, default: null },
    employeeJoiningDate: { type: String, default: null },
    employeeDepartmentId: { type: String, default: '' },
    employeeRoleId: { type: String, default: '', required: true },
    revenueCenters: [{ type: String, default: '' }],
    storeId: { type: String, required: true },
    employeePaytype: {
        type: Number,
        min: HOURLY,
        max: JOB,
        default: HOURLY,
        validate: validator
    },
})

export {
    EmployeeStoreSchema
}