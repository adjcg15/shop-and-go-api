import { InferAttributes } from "sequelize";
import Product from "../../models/Product";

interface IProductWithStock extends InferAttributes<Product> { 
    stock: number 
};

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

interface IProductCategory {
    id?: number;
    name?: string;
    isActive?: boolean;
}

export {
    IProductWithStock,
    IErrorMessageWithCode,
    IProductCategory
};