import { Association, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Client from "./Client";
import { IDB } from "../types/interfaces/db";
import Order from "./Order";

export default class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    declare id: CreationOptional<number>;
    declare street: string;
    declare streetNumber: string;
    declare apartmentNumber: CreationOptional<string | null>;
    declare neighborhood: string;
    declare municipality: string;
    declare city: string;
    declare postalCode: string;
    declare state: string;
    declare latitude: number;
    declare longitude: number;
    declare isActive: boolean;

    declare idClient: ForeignKey<Client["id"]>;
    declare resident?: NonAttribute<Client>;
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
    declare createOrder: HasManyCreateAssociationMixin<Order, "idDeliveryAddress">;

    declare static associations: {
        resident: Association<Address, Client>;
        orders: Association<Address, Order>;
    };

    static associate(models: IDB) {
        Address.belongsTo(models.Client, {
            foreignKey: "idCliente",
            as: "resident"
        });
        Address.hasMany(models.Order, {
            foreignKey: "idDireccionEntrega",
            as: "orders"
        });
    }
}