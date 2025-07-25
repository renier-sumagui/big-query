import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config()

const secretFile = path.join(__dirname, "../../env/.env.json")

if (fs.existsSync(secretFile)) {
    process.env = {
        ...process.env,
        ...require(secretFile)
    }
}

const port = process.env.APP_PORT || 3011;
const host = process.env.APP_HOST || "0.0.0.0";
const name = process.env.APP_NAME || "bigquery-gateway";
const env = process.env.NODE_ENV || "staging";
const jwtsecret = process.env.JWT_SECRET || "secret"

const ordersDB = process.env.ORDERS_DB || "fix mongo uri";
const merchantsDB = process.env.MERCHANTS_DB || "fix mongo uri";
const usersDB = process.env.USERS_DB || "fix mongo uri";
const paymentsDB = process.env.PAYMENTS_DB || "fix mongo uri";
const rolesDB = process.env.ROLES_DB || "fix mongo uri";

const dataset = process.env.BIGQUERY_DATASET || "fix dataset";
const ordersTable = process.env.ORDERS_TABLE || "orders";
const employeesTable = process.env.EMPLOYEES_TABLE || "employees";
const merchantsTable = process.env.MERCHANTS_TABLE || "merchants";
const paymentsTable = process.env.PAYMENTS_TABLE || "payments";
const googleProjectId = process.env.GOOGLE_PROJECT_ID || "fix project id";
const ordersUri = process.env.ORDERS_URI || 'http://127.0.0.1:3004';
const googleAppCreds = process.env.GOOGLE_APP_CREDENTIALS as string || "./gcp-creds.json";

const app = {
    port,
    host,
    name,
    env,
    jwtsecret,
    database: {
        ordersDB,
        merchantsDB,
        usersDB,
        paymentsDB,
        rolesDB
    },
    bigQuery: {
        dataset,
        ordersTable,
        employeesTable,
        merchantsTable,
        paymentsTable,
        googleProjectId,
        googleAppCreds,
    },
    ordersUri
};

console.log("CONFIG/APP:", app);

export { app };