import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import PaymentMethod from "../../models/PaymentMethod";
import Employee from "../../models/Employee";
import Client from "../../models/Client";
import UserRoles from "../enums/user_roles";
import Issuer from "../../models/Issuer";
import Inventory from "../../models/Inventory";

interface IProductWithInventory extends InferAttributes<Product> { 
    inventory: Inventory 
};

interface IPaymentMethodWithIssuer extends InferAttributes<PaymentMethod> {
    issuer: Issuer
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
    IProductWithInventory,
    IErrorMessageWithCode,
    IPaymentMethodWithIssuer,
    IEmployeeWithPosition,
    IClientWithOptionalPassword,
    isEmployeeWithPosition
};