import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import PaymentMethod from "../../models/PaymentMethod";
import Employee from "../../models/Employee";
import Client from "../../models/Client";
import UserRoles from "../enums/user_roles";
import Issuer from "../../models/Issuer";
import Inventory from "../../models/Inventory";
import ProductCategory from "../../models/ProductCategory";

interface IProductWithInventory extends InferAttributes<Product> { 
    inventory: Inventory 
};

interface IProductWithCategory extends InferAttributes<Product> {
    category: ProductCategory
}

interface IPaymentMethodWithIssuer {
    id: number,
    cardholderName: string,
    endCardNumber: string,
    bankIssuer: string
}

interface IClientWithOptionalPassword extends Omit<InferAttributes<Client>, 'passwordHash'> {
    passwordHash?: string,
    token?: string
}

interface IEmployeeWithPosition extends Omit<InferAttributes<Employee>, 'passwordHash'>{
    passwordHash?: string,
    position: UserRoles,
    token?: string
}

interface IProductByIdWithStock {
    idProduct?: number;
    stock?: number;
}

function isEmployeeWithPosition(user: IClientWithOptionalPassword | IEmployeeWithPosition): user is IEmployeeWithPosition {
    return (user as IEmployeeWithPosition).position !== undefined;
}

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

export {
    IProductWithInventory,
    IProductWithCategory,
    IErrorMessageWithCode,
    IPaymentMethodWithIssuer,
    IEmployeeWithPosition,
    IClientWithOptionalPassword,
    isEmployeeWithPosition,
    IProductByIdWithStock
};