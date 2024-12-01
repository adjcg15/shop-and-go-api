import { Association, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Issuer from "./Issuer";
import { IDB } from "../types/interfaces/db";
import Client from "./Client";
import Order from "./Order";

export default class PaymentMethod extends Model<InferAttributes<PaymentMethod>, InferCreationAttributes<PaymentMethod>> {
    declare id: CreationOptional<number>;
    declare expirationYear: number;
    declare expirationMonth: number;
    declare cvcCode: string;
    declare cardNumber: string;
    declare cardholderName: string;
    declare isActive: boolean;

    declare idIssuer: ForeignKey<Issuer["id"]>;
    declare issuer?: NonAttribute<Issuer>;
    declare idClient: ForeignKey<Client["id"]>;
    declare owner?: NonAttribute<Client>;
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
    declare createOrder: HasManyCreateAssociationMixin<Order, "idClient">;

    declare static associations: {
        issuer: Association<PaymentMethod, Issuer>;
        owner: Association<PaymentMethod, Client>;
        orders: Association<PaymentMethod, Order>;
    };

    static associate(models: IDB) {
        PaymentMethod.belongsTo(models.Issuer, {
            foreignKey: "idEmisor",
            as: "issuer"
        });
        PaymentMethod.belongsTo(models.Client, {
            foreignKey: "idCliente",
            as: "owner"
        });
        PaymentMethod.hasMany(models.Order, {
            foreignKey: "idMetodoPago",
            as: "orders"
        });
    }
}