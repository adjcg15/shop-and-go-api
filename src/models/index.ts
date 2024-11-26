import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import dbConfig from "../config/db";
import { IDB } from "../types/interfaces/db";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];
const db: Partial<IDB> = {};

const sequelize = new Sequelize(config);

fs
    .readdirSync(path.join(__dirname, "factories"))
    .filter(file => {
        return file.indexOf(".") !== 0 && file.slice(-3) === ".ts";
    })
    .forEach(async file => {
        const { default: modelFactory } = await import(path.join(__dirname, "factories", file));
        const model = modelFactory(sequelize);
        db[model.name as keyof IDB] = model;
    });

Object.keys(db)
    .filter(key => key !== "sequelize")
    .forEach(modelName => {
        const model = db[modelName as keyof Omit<IDB, "sequelize">];
        if (model && typeof model.associate === "function") {
            model.associate(db as IDB);
        }
    });
    
db.sequelize = sequelize;

export default db as IDB;