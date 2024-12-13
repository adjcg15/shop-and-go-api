import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import Inventory from "../../models/Inventory";
import Order from "../../models/Order";
import OrderProduct from "../../models/OrderProduct";

interface IInventoryWithOptionalProductId extends Omit<InferAttributes<Inventory>, "id" | 'idProduct' | "idStore"> {
    id?: number;
    idProduct?: number;
    idStore?: number;
}

interface IProductWithInventoriesBody extends Omit<InferAttributes<Product>, "isActive" | "barCode"> {
    barCode?: string;
    isActive?: boolean;
    inventories?: IInventoryWithOptionalProductId[];
}

interface ILoginBody {
    phoneNumber?: string;
    username?: string;
    password?: string;
}

interface IOrderProducts extends Omit<InferAttributes<OrderProduct>, "id" | "idOrder"> {
    id?: number;
    idOrder?: number;
}

interface IOrderWithQuantitiesOfProducts extends Omit<InferAttributes<Order>, "dateOfPurchase"> {
    idStore?: number;
    products?: IOrderProducts[]; 
}

export {
    IInventoryWithOptionalProductId,
    IProductWithInventoriesBody,
    ILoginBody,
    IOrderWithQuantitiesOfProducts,
    IOrderProducts
}