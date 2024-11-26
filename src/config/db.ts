import dotenv from "dotenv";
import { IDBEnviroment } from "../types/interfaces/db";
dotenv.config();

const dbConfig: IDBEnviroment = {
    development: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
        host: process.env.DB_HOST || "",
        port: Number(process.env.DB_PORT),
        dialect: "mssql",
        logging: false
    },
    test: {
        username: "root",
        password: "password",
        database: "database_test",
        host: "127.0.0.1",
        port: Number(process.env.DB_PORT),
        dialect: "mssql",
        logging: false
    },
    production: {
        username: "root",
        password: "password",
        database: "database_production",
        host: "127.0.0.1",
        port: Number(process.env.DB_PORT),
        dialect: "mssql",
        logging: false
    }
};

export default dbConfig;