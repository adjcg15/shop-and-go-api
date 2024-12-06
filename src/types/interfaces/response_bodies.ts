import { InferAttributes } from "sequelize";
import Product from "../../models/Product";

interface IProductWithStock extends InferAttributes<Product> { 
    stock: number 
};

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

export {
    IProductWithStock,
    IErrorMessageWithCode
};