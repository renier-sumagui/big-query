import { createServer } from "http";
import { app } from "./config";
import service from "./bigqueryService";
import "./scheduler";

const server = createServer(service);

const port = app.port as number;
const host = app.host;

server.listen(port, host, () => {
    console.log(`${app.name} running in ${app.host}:${app.port}`);
});