import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Order from "./Order";
import Product from "./Product";
import { IDB } from "../types/interfaces/db";

export default class OrderProduct extends Model<InferAttributes<OrderProduct>, InferCreationAttributes<OrderProduct>> {
    declare id: CreationOptional<number>;
    declare amount: number;

    declare idOrder: ForeignKey<Order["id"]>;
    declare order?: NonAttribute<Order>;
    declare idProduct: ForeignKey<Product["id"]>;
    declare product?: NonAttribute<Product>;
    
    declare static associations: {
        order: Association<OrderProduct, Order>;
        product: Association<OrderProduct, Product>;
    };

    static associate(models: IDB) {
        OrderProduct.belongsTo(models.Order, {
            foreignKey: "idPedido",
            as: "order"
        });

        OrderProduct.belongsTo(models.Product, {
            foreignKey: "idProducto",
            as: "product"
        });
    }
}