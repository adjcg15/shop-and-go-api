import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Product from "./Product";
import Store from "./Store";
import { IDB } from "../types/interfaces/db";

export default class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    declare id: CreationOptional<number>;
    declare stock: number;

    declare idProduct: ForeignKey<Product["id"]>;
    declare idStore: ForeignKey<Product["id"]>;
    declare product?: NonAttribute<Product>;
    declare store?: NonAttribute<Store>;

    declare static associations: {
        product: Association<Inventory, Product>;
        store: Association<Inventory, Store>;
    };

    static associate(models: IDB) {
        Inventory.belongsTo(models.Product, {
            foreignKey: "idProducto",
            as: "product"
        });
        Inventory.belongsTo(models.Store, {
            foreignKey: "idSucursal",
            as: "store"
        });
    }
}