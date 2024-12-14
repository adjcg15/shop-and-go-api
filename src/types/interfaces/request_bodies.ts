import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import Inventory from "../../models/Inventory";
import Order from "../../models/Order";
import OrderProduct from "../../models/OrderProduct";

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

interface IProductsByIdBody {
    productsId?: number[];
}

export {
    IInventoryWithOptionalProductIdBody,
    IProductWithInventoriesBody,
    ILoginBody,
    IOrderWithQuantitiesOfProductsBody,
    IOrderProductsBody,
    IProductsByIdBody
}