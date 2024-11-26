import { Options, Sequelize } from "sequelize";
import Product from "../../models/Product";
import ProductCategory from "../../models/ProductCategory";

interface IDBModel {
    associate: (db: IDB) => void;
};

interface IDBEnviroment {
    [key: string]: Options;
};

interface IDB {
    Product: typeof Product & IDBModel;
    ProductCategory: typeof ProductCategory & IDBModel;
    sequelize: Sequelize;
};

export {
    IDBEnviroment,
    IDB,
    IDBModel
};