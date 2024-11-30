import { Options, Sequelize } from "sequelize";
import Product from "../../models/Product";
import ProductCategory from "../../models/ProductCategory";
import Store from "../../models/Store";
import Inventory from "../../models/Inventory";
import Employee from "../../models/Employee";
import EmployeePosition from "../../models/EmployeePosition";

interface IDBModel {
    associate: (db: IDB) => void;
};

interface IDBEnviroment {
    [key: string]: Options;
};

interface IDB {
    Product: typeof Product & IDBModel;
    ProductCategory: typeof ProductCategory & IDBModel;
    Store: typeof Store & IDBModel;
    Inventory: typeof Inventory & IDBModel;
    Employee: typeof Employee & IDBModel;
    EmployeePosition: typeof EmployeePosition & IDBModel;
    sequelize: Sequelize;
};

export {
    IDBEnviroment,
    IDB,
    IDBModel
};