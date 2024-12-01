import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Employee from "./Employee";
import { IDB } from "../types/interfaces/db";

export default class EmployeePosition extends Model<InferAttributes<EmployeePosition>, InferCreationAttributes<EmployeePosition>> {
    declare id: CreationOptional<number>;
    declare title: string;

    declare employees?: NonAttribute<Employee[]>;

    declare getEmployees: HasManyGetAssociationsMixin<Employee>;
    declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
    declare addEmployees: HasManyAddAssociationsMixin<Employee, number>;
    declare setEmployees: HasManySetAssociationsMixin<Employee, number>;
    declare removeEmployee: HasManyRemoveAssociationMixin<Employee, number>;
    declare removeEmployees: HasManyRemoveAssociationsMixin<Employee, number>;
    declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;
    declare hasEmployees: HasManyHasAssociationsMixin<Employee, number>;
    declare countEmployees: HasManyCountAssociationsMixin;
    declare createEmployee: HasManyCreateAssociationMixin<Employee, "idPosition">;

    declare static associations: {
        employees: Association<EmployeePosition, Employee>;
    };

    static associate(models: IDB) {
        EmployeePosition.hasMany(models.Employee, {
            foreignKey: "idCargoTrabajador",
            as: "employees"
        });
    }
}