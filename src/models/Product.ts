import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { IDB } from "../types/interfaces/db";
import ProductCategory from "./ProductCategory";

export default class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare barCode: string;
    declare name: string;
    declare description: string;
    declare image: Buffer | null;
    declare expirationDate: Date;
    declare salePrice: number;
    declare maximumAmount: number;

    declare idCategory: ForeignKey<ProductCategory['id']>;
    declare category?: NonAttribute<ProductCategory>;

    declare static associations: {
        category: Association<Product, ProductCategory>;
    };

    static associate(models: IDB) {
        Product.belongsTo(models.ProductCategory, { 
            targetKey: "id",
            as: "category"
        });
    }
}
