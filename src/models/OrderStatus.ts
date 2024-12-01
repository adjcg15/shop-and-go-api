import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Order from "./Order";
import { IDB } from "../types/interfaces/db";

export default class OrderStatus extends Model<InferAttributes<OrderStatus>, InferCreationAttributes<OrderStatus>> {
    declare id: CreationOptional<number>;
    declare title: string;

    declare orders?: NonAttribute<Order[]>;

    declare getOrders: HasManyGetAssociationsMixin<Order>;
    declare addOrder: HasManyAddAssociationMixin<Order, number>;
    declare addOrders: HasManyAddAssociationsMixin<Order, number>;
    declare setOrders: HasManySetAssociationsMixin<Order, number>;
    declare removeOrder: HasManyRemoveAssociationMixin<Order, number>;
    declare removeOrders: HasManyRemoveAssociationsMixin<Order, number>;
    declare hasOrder: HasManyHasAssociationMixin<Order, number>;
    declare hasOrders: HasManyHasAssociationsMixin<Order, number>;
    declare countOrders: HasManyCountAssociationsMixin;
    declare createOrder: HasManyCreateAssociationMixin<Order, "idStatus">;

    declare static associations: {
        orders: Association<OrderStatus, Order>;
    };

    static associate(models: IDB) {
        OrderStatus.hasMany(models.Order, {
            foreignKey: "idEstadoPedido",
            as: "orders"
        });
    }
}