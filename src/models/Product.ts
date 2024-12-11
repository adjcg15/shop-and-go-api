import { Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { IDB } from "../types/interfaces/db";
import ProductCategory from "./ProductCategory";
import Order from "./Order";
import Store from "./Store";

export default class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare barCode: string;
    declare name: string;
    declare description: string;
    declare imageUrl: string;
    declare salePrice: number;
    declare maximumAmount: number;

    declare idCategory: ForeignKey<ProductCategory["id"]>;
    declare category?: NonAttribute<ProductCategory>;
    declare stores?: NonAttribute<Store[]>;
    declare orders?: NonAttribute<Order[]>;

    declare getStores: BelongsToManyGetAssociationsMixin<Store>;
    declare addStore: BelongsToManyAddAssociationMixin<Store, number>;
    declare addStores: BelongsToManyAddAssociationsMixin<Store, number>;
    declare setStores: BelongsToManySetAssociationsMixin<Store, number>;
    declare removeStore: BelongsToManyRemoveAssociationMixin<Store, number>;
    declare removeStores: BelongsToManyRemoveAssociationsMixin<Store, number>;
    declare hasStore: BelongsToManyHasAssociationMixin<Store, number>;
    declare hasStores: BelongsToManyHasAssociationsMixin<Store, number>;
    declare countStores: BelongsToManyCountAssociationsMixin;
    declare createStore: BelongsToManyCreateAssociationMixin<Store>;

    declare getOrders: BelongsToManyGetAssociationsMixin<Order>;
    declare addOrder: BelongsToManyAddAssociationMixin<Order, number>;
    declare addOrders: BelongsToManyAddAssociationsMixin<Order, number>;
    declare setOrders: BelongsToManySetAssociationsMixin<Order, number>;
    declare removeOrder: BelongsToManyRemoveAssociationMixin<Order, number>;
    declare removeOrders: BelongsToManyRemoveAssociationsMixin<Order, number>;
    declare hasOrder: BelongsToManyHasAssociationMixin<Order, number>;
    declare hasOrders: BelongsToManyHasAssociationsMixin<Order, number>;
    declare countOrders: BelongsToManyCountAssociationsMixin;
    declare createOrder: BelongsToManyCreateAssociationMixin<Order>;

    declare static associations: {
        category: Association<Product, ProductCategory>;
        stores: Association<Product, Store>;
        orders: Association<Product, Order>;
    };

    static associate(models: IDB) {
        Product.belongsTo(models.ProductCategory, {
            foreignKey: "idCategoria",
            as: "category"
        });
        Product.belongsToMany(models.Store, {
            through: models.Inventory,
            foreignKey: "idProducto",
            otherKey: "idSucursal",
            as: "stores"
        });
        Product.belongsToMany(models.Order, {
            through: models.OrderProduct,
            foreignKey: "idProducto",
            otherKey: "idPedido",
            as: "orders"
        });
    }
}
