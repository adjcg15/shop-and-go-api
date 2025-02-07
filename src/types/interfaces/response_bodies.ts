import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import Employee from "../../models/Employee";
import Client from "../../models/Client";
import UserRoles from "../enums/user_roles";
import Inventory from "../../models/Inventory";
import ProductCategory from "../../models/ProductCategory";

interface IProductWithInventory extends InferAttributes<Product> {
    inventory: Inventory;
}

interface IProductWithStock extends InferAttributes<Product> {
    stock: number;
}

interface IPaymentMethodWithIssuer {
    id: number;
    cardholderName: string;
    endCardNumber: string;
    bankIssuer: string;
}

interface IClientWithOptionalPassword
    extends Omit<InferAttributes<Client>, "passwordHash"> {
    passwordHash?: string;
    token?: string;
}

interface IEmployeeWithPosition
    extends Omit<InferAttributes<Employee>, "passwordHash"> {
    passwordHash?: string;
    position: UserRoles;
    token?: string;
}

interface IProductByIdWithStock {
    idProduct?: number;
    stock?: number;
}

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

interface IClientAddress {
    id: number;
    street: string;
    streetNumber: string;
    apartmentNumber?: string;
    neighborhood: string;
    municipality: string;
    city: string;
    postalCode: string;
    state: string;
    latitude: number;
    longitude: number;
}

export {
    IProductWithInventory,
    IErrorMessageWithCode,
    IPaymentMethodWithIssuer,
    IEmployeeWithPosition,
    IClientWithOptionalPassword,
    IProductWithStock,
    IProductByIdWithStock,
    IClientAddress,
};
