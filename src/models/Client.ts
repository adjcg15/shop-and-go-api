import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import PaymentMethod from "./PaymentMethod";
import { IDB } from "../types/interfaces/db";
import Address from "./Address";
import Order from "./Order";

export default class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
    declare id: CreationOptional<number>;
    declare passwordHash: string;
    declare birthdate: string;
    declare fullName: string;
    declare phoneNumber: string;

    declare paymentMethods?: NonAttribute<PaymentMethod[]>;
    declare deliveryAddresses?: NonAttribute<Address[]>;
    declare orders?: NonAttribute<Order[]>;

    declare getPaymentMethods: HasManyGetAssociationsMixin<PaymentMethod>;
    declare addPaymentMethod: HasManyAddAssociationMixin<PaymentMethod, number>;
    declare addPaymentMethods: HasManyAddAssociationsMixin<PaymentMethod, number>;
    declare setPaymentMethods: HasManySetAssociationsMixin<PaymentMethod, number>;
    declare removePaymentMethod: HasManyRemoveAssociationMixin<PaymentMethod, number>;
    declare removePaymentMethods: HasManyRemoveAssociationsMixin<PaymentMethod, number>;
    declare hasPaymentMethod: HasManyHasAssociationMixin<PaymentMethod, number>;
    declare hasPaymentMethods: HasManyHasAssociationsMixin<PaymentMethod, number>;
    declare countPaymentMethods: HasManyCountAssociationsMixin;
    declare createPaymentMethod: HasManyCreateAssociationMixin<PaymentMethod, "idClient">;
    
    declare getAddresses: HasManyGetAssociationsMixin<Address>;
    declare addAddress: HasManyAddAssociationMixin<Address, number>;
    declare addAddresses: HasManyAddAssociationsMixin<Address, number>;
    declare setAddresses: HasManySetAssociationsMixin<Address, number>;
    declare removeAddress: HasManyRemoveAssociationMixin<Address, number>;
    declare removeAddresses: HasManyRemoveAssociationsMixin<Address, number>;
    declare hasAddress: HasManyHasAssociationMixin<Address, number>;
    declare hasAddresses: HasManyHasAssociationsMixin<Address, number>;
    declare countAddresses: HasManyCountAssociationsMixin;
    declare createAddress: HasManyCreateAssociationMixin<Address, "idClient">;
    
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
        paymentMethods: Association<Client, PaymentMethod>;
        deliveryAddresses: Association<Client, Address>;
        orders: Association<Client, Order>;
    };

    static associate(models: IDB) {
        Client.hasMany(models.PaymentMethod, {
            foreignKey: "idCliente",
            as: "paymentMethods"
        });
        Client.hasMany(models.Address, {
            foreignKey: "idCliente",
            as: "deliveryAddresses"
        });
        Client.hasMany(models.Order, {
            foreignKey: "idCliente",
            as: "orders"
        });
    }
}