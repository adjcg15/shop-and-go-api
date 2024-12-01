import { Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Product from "./Inventory";
import Employee from "./Employee";
import { IDB } from "../types/interfaces/db";

export default class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare completeAddress: string;
    declare openingTime: string;
    declare closingTime: string;
    declare latitude: number;
    declare longitude: number;

    declare products?: NonAttribute<Product[]>;
    declare employees?: NonAttribute<Employee[]>;

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
    
    declare getEmployees: HasManyGetAssociationsMixin<Employee>;
    declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
    declare addEmployees: HasManyAddAssociationsMixin<Employee, number>;
    declare setEmployees: HasManySetAssociationsMixin<Employee, number>;
    declare removeEmployee: HasManyRemoveAssociationMixin<Employee, number>;
    declare removeEmployees: HasManyRemoveAssociationsMixin<Employee, number>;
    declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;
    declare hasEmployees: HasManyHasAssociationsMixin<Employee, number>;
    declare countEmployees: HasManyCountAssociationsMixin;
    declare createEmployee: HasManyCreateAssociationMixin<Employee, "idStore">;

    declare static associations: {
        products: Association<Store, Product>;
        employees: Association<Store, Employee>;
    };

    static associate(models: IDB) {
        Store.belongsToMany(models.Product, {
            through: models.Inventory,
            foreignKey: "idSucursal",
            otherKey: "idProducto",
            as: "products"
        });
        Store.hasMany(models.Employee, {
            foreignKey: "idSucursal",
            as: "employees"
        });
    }
}