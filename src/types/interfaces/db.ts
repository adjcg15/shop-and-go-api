import { Options, Sequelize } from "sequelize";
import Product from "../../models/Product";
import ProductCategory from "../../models/ProductCategory";
import Store from "../../models/Store";
import Inventory from "../../models/Inventory";
import Employee from "../../models/Employee";
import EmployeePosition from "../../models/EmployeePosition";
import PaymentMethod from "../../models/PaymentMethod";
import Issuer from "../../models/Issuer";
import Client from "../../models/Client";
import Address from "../../models/Address";
import Order from "../../models/Order";
import OrderStatus from "../../models/OrderStatus";
import Incident from "../../models/Incident";
import OrderProduct from "../../models/OrderProduct";

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
    PaymentMethod: typeof PaymentMethod & IDBModel;
    Issuer: typeof Issuer & IDBModel;
    Client: typeof Client & IDBModel;
    Address: typeof Address & IDBModel;
    Order: typeof Order & IDBModel;
    OrderStatus: typeof OrderStatus & IDBModel;
    Incident: typeof Incident & IDBModel;
    OrderProduct: typeof OrderProduct & IDBModel;
    sequelize: Sequelize;
};

export {
    IDBEnviroment,
    IDB,
    IDBModel
};