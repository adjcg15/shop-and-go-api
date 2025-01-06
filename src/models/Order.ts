import { Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import OrderStatus from "./OrderStatus";
import { IDB } from "../types/interfaces/db";
import Address from "./Address";
import Client from "./Client";
import PaymentMethod from "./PaymentMethod";
import Incident from "./Incident";
import Product from "./Product";
import Store from "./Store";

export default class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<number>;
    declare dateOfPurchase: string;
    declare deliveryDate: CreationOptional<string | null>;

    declare idStatus: ForeignKey<OrderStatus["id"]>;
    declare status?: NonAttribute<OrderStatus>;
    declare idDeliveryAddress: ForeignKey<Address["id"]>;
    declare deliveryAddress?: NonAttribute<Address>;
    declare idClient: ForeignKey<Client["id"]>;
    declare client?: NonAttribute<Client>;
    declare idPaymentMethod: ForeignKey<PaymentMethod["id"]>;
    declare paymentMethod?: NonAttribute<PaymentMethod>;
    declare idStore: ForeignKey<Store["id"]>;
    declare store?: NonAttribute<Store>;

    declare incident?: NonAttribute<Incident>;
    declare products?: NonAttribute<Product[]>;

    declare getProducts: BelongsToManyGetAssociationsMixin<Product>;
    declare addProduct: BelongsToManyAddAssociationMixin<Product, number>;
    declare addProducts: BelongsToManyAddAssociationsMixin<Product, number>;
    declare setProducts: BelongsToManySetAssociationsMixin<Product, number>;
    declare removeProduct: BelongsToManyRemoveAssociationMixin<Product, number>;
    declare removeProducts: BelongsToManyRemoveAssociationsMixin<Product, number>;
    declare hasProduct: BelongsToManyHasAssociationMixin<Product, number>;
    declare hasProducts: BelongsToManyHasAssociationsMixin<Product, number>;
    declare countProducts: BelongsToManyCountAssociationsMixin;
    declare createProduct: BelongsToManyCreateAssociationMixin<Product>;

    declare static associations: {
        status: Association<Order, OrderStatus>;
        deliveryAddress: Association<Order, Address>;
        client: Association<Order, Client>;
        paymentMethod: Association<Order, PaymentMethod>;
        incident: Association<Order, Incident>;
        products: Association<Order, Product>; 
    };

    static associate(models: IDB) {
        Order.belongsTo(models.OrderStatus, {
            foreignKey: "idEstadoPedido",
            as: "status"
        });
        Order.belongsTo(models.Address, {
            foreignKey: "idDireccionEntrega",
            as: "deliveryAddress"
        });
        Order.belongsTo(models.Client, {
            foreignKey: "idCliente",
            as: "client"
        });
        Order.belongsTo(models.PaymentMethod, {
            foreignKey: "idMetodoPago",
            as: "paymentMethod"
        });
        Order.belongsTo(models.Store, {
            foreignKey: "idSucursal",
            as: "store"
        });
        Order.hasOne(models.Incident, {
            foreignKey: "idPedido",
            as: "incident"
        });
        Order.belongsToMany(models.Product, {
            through: models.OrderProduct,
            foreignKey: "idPedido",
            otherKey: "idProducto",
            as: "products"
        });
    }
}