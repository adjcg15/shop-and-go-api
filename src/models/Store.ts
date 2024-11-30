import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { IDB } from "types/interfaces/db";
import Inventory from "./Inventory";
import Employee from "./Employee";

export default class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare completeAddress: string;
    declare openingTime: string;
    declare closingTime: string;
    declare latitude: number;
    declare longitude: number;

    declare inventories?: NonAttribute<Inventory[]>;
    declare employees?: NonAttribute<Employee[]>;

    declare getInventories: HasManyGetAssociationsMixin<Inventory>;
    declare addInventory: HasManyAddAssociationMixin<Inventory, number>;
    declare addInventories: HasManyAddAssociationsMixin<Inventory, number>;
    declare setInventories: HasManySetAssociationsMixin<Inventory, number>;
    declare removeInventory: HasManyRemoveAssociationMixin<Inventory, number>;
    declare removeInventories: HasManyRemoveAssociationsMixin<Inventory, number>;
    declare hasInventory: HasManyHasAssociationMixin<Inventory, number>;
    declare hasInventories: HasManyHasAssociationsMixin<Inventory, number>;
    declare countInventories: HasManyCountAssociationsMixin;
    declare createInventory: HasManyCreateAssociationMixin<Inventory, "idStore">;
    
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
        inventories: Association<Store, Inventory>;
        employees: Association<Store, Employee>;
    };

    static associate(models: IDB) {
        Store.hasMany(models.Inventory, {
            foreignKey: "idSucursal",
            as: "inventories"
        });
        Store.hasMany(models.Employee, {
            foreignKey: "idSucursal",
            as: "employees"
        });
    }
}