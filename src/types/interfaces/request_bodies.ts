import { InferAttributes } from "sequelize";
import Product from "../../models/Product";
import Inventory from "../../models/Inventory";

interface IInventoryWithOptionalProductId extends Omit<InferAttributes<Inventory>, 'idProduct'> {
    idProduct?: number
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

export {
    IInventoryWithOptionalProductId,
    IProductWithInventoriesBody,
    ILoginBody
}