import dotenv from "dotenv";
import { IDBEnviroment } from "../types/interfaces/db";
dotenv.config();

const dbConfig: IDBEnviroment = {
    development: {
        username: process.env.DB_USER_DEV || "",
        password: process.env.DB_PASSWORD_DEV || "",
        database: process.env.DB_NAME_DEV || "",
        host: process.env.DB_HOST_DEV || "",
        port: Number(process.env.DB_PORT_DEV),
        dialect: "mssql",
        logging: false
    },
    test: {
        username: process.env.DB_USER_TEST || "",
        password: process.env.DB_PASSWORD_TEST || "",
        database: process.env.DB_NAME_TEST || "",
        host: process.env.DB_HOST_TEST || "",
        port: Number(process.env.DB_PORT_TEST),
        dialect: "mssql",
        logging: false
    },
    production: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
        host: process.env.DB_HOST || "",
        port: Number(process.env.DB_PORT),
        dialect: "mssql",
        logging: false
    }
};

export default dbConfig;