import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import PaymentMethod from "../../models/PaymentMethod";

interface IProductWithStock extends InferAttributes<Product> { 
    stock: number 
};

interface IPaymentMethodWithIssuer extends InferAttributes<PaymentMethod> {
    issuer: string
}

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

export {
    IProductWithStock,
    IErrorMessageWithCode,
    IPaymentMethodWithIssuer
};