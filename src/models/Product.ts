import { Association, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { IDB } from "../types/interfaces/db";
import ProductCategory from "./ProductCategory";
import Inventory from "./Inventory";

export default class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare barCode: string;
    declare name: string;
    declare description: string;
    declare image: Buffer | null;
    declare expirationDate: Date;
    declare salePrice: number;
    declare maximumAmount: number;

    declare idCategory: ForeignKey<ProductCategory["id"]>;
    declare category?: NonAttribute<ProductCategory>;
    declare inventories?: NonAttribute<Inventory[]>;

    declare getInventories: HasManyGetAssociationsMixin<Inventory>;
    declare addInventory: HasManyAddAssociationMixin<Inventory, number>;
    declare addInventories: HasManyAddAssociationsMixin<Inventory, number>;
    declare setInventories: HasManySetAssociationsMixin<Inventory, number>;
    declare removeInventory: HasManyRemoveAssociationMixin<Inventory, number>;
    declare removeInventories: HasManyRemoveAssociationsMixin<Inventory, number>;
    declare hasInventory: HasManyHasAssociationMixin<Inventory, number>;
    declare hasInventories: HasManyHasAssociationsMixin<Inventory, number>;
    declare countInventories: HasManyCountAssociationsMixin;
    declare createInventory: HasManyCreateAssociationMixin<Inventory, "idProduct">;

    declare static associations: {
        category: Association<Product, ProductCategory>;
        inventories: Association<Product, Inventory>;
    };

    static associate(models: IDB) {
        Product.belongsTo(models.ProductCategory, {
            foreignKey: "idCategoria",
            as: "category"
        });
        Product.hasMany(models.Inventory, {
            foreignKey: "idProducto",
            as: "inventories"
        });
    }
}
