import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import PaymentMethod from "../../models/PaymentMethod";
import Employee from "../../models/Employee";
import Client from "../../models/Client";
import UserRoles from "../enums/user_roles";

interface IProductWithStock extends InferAttributes<Product> { 
    stock: number 
};

interface IPaymentMethodWithIssuer extends InferAttributes<PaymentMethod> {
    issuer: string
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

function isEmployeeWithPosition(user: IClientWithOptionalPassword | IEmployeeWithPosition): user is IEmployeeWithPosition {
    return (user as IEmployeeWithPosition).position !== undefined;
}

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

export {
    IProductWithStock,
    IErrorMessageWithCode,
    IPaymentMethodWithIssuer,
    IEmployeeWithPosition,
    IClientWithOptionalPassword,
    isEmployeeWithPosition
};