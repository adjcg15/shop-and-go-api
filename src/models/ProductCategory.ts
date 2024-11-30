import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { IDB } from "../types/interfaces/db";
import Product from "./Product";

export default class ProductCategory extends Model<InferAttributes<ProductCategory>, InferCreationAttributes<ProductCategory>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare isActive: boolean;

    declare products?: NonAttribute<Product[]>;

    declare getProducts: HasManyGetAssociationsMixin<Product>;
    declare addProduct: HasManyAddAssociationMixin<Product, number>;
    declare addProducts: HasManyAddAssociationsMixin<Product, number>;
    declare setProducts: HasManySetAssociationsMixin<Product, number>;
    declare removeProduct: HasManyRemoveAssociationMixin<Product, number>;
    declare removeProducts: HasManyRemoveAssociationsMixin<Product, number>;
    declare hasProduct: HasManyHasAssociationMixin<Product, number>;
    declare hasProducts: HasManyHasAssociationsMixin<Product, number>;
    declare countProducts: HasManyCountAssociationsMixin;
    declare createProduct: HasManyCreateAssociationMixin<Product, "idCategory">;

    declare static associations: {
        products: Association<ProductCategory, Product>;
    };

    static associate(models: IDB) {
        ProductCategory.hasMany(models.Product, {
            foreignKey: "idCategoria",
            as: "products"
        });
    }
}