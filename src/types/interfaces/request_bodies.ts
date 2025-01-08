import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import Inventory from "../../models/Inventory";
import Order from "../../models/Order";
import OrderProduct from "../../models/OrderProduct";
import EmployeePosition from "../../models/EmployeePosition";
import Store from "../../models/Store";

interface IInventoryWithOptionalProductIdBody extends Omit<InferAttributes<Inventory>, "id" | 'idProduct' | "idStore"> {
    id?: number;
    idProduct?: number;
    idStore?: number;
}

interface IProductWithInventoriesBody extends Omit<InferAttributes<Product>, "isActive" | "barCode"> {
    barCode?: string;
    isActive?: boolean;
    inventories?: IInventoryWithOptionalProductIdBody[];
}

interface ILoginBody {
    phoneNumber?: string;
    username?: string;
    password?: string;
}

interface IOrderProductsBody extends Omit<InferAttributes<OrderProduct>, "id" | "idOrder"> {
    id?: number;
    idOrder?: number;
}

interface IOrderWithQuantitiesOfProductsBody extends Omit<InferAttributes<Order>, "dateOfPurchase" | "idStatus"> {
    idStore?: number;
    products?: IOrderProductsBody[]; 
}

interface IPaymentMethodBody {
    cardholderName?: string;
    expirationMonth?: number;
    expirationYear?: number;
    cardNumber?: string;
    idIssuer?: number;
}

interface IProductsByIdBody {
    productsId?: number[];
}

interface ICoordinatesBody {
    latitude?: number;
    longitude?: number;
}

interface IClientAddressBody {
    street?: string;
    streetNumber?: string;
    apartmentNumber?: string;
    neighborhood?: string;
    municipality?: string;
    city?: string;
    postalCode?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
}

interface IClientBody {
    password?: string,
    birthdate?: string,
    fullName?: string,
    phoneNumber?: string
}

interface IEmployeeBody {
    fullName?: string,
    user?: string,
    password?: string,
    registrationDate?: string,
    idStore?: number,
    idPosition?: number
}

interface IDeliverOrderBody {
    idOrder: number,
}

interface IAssignOrderBody {
    idOrder: number;
    idDeliveryMan: number;
}

export {
    IInventoryWithOptionalProductIdBody,
    IProductWithInventoriesBody,
    ILoginBody,
    IOrderWithQuantitiesOfProductsBody,
    IOrderProductsBody,
    IPaymentMethodBody,
    IProductsByIdBody,
    ICoordinatesBody,
    IClientAddressBody,
    IClientBody,
    IEmployeeBody,
    IDeliverOrderBody,
    IAssignOrderBody
}