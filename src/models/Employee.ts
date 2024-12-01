import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Store from "./Store";
import { IDB } from "../types/interfaces/db";
import EmployeePosition from "./EmployeePosition";

export default class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare id: CreationOptional<number>;
    declare fullName: string;
    declare user: string;
    declare passwordHash: string;
    declare registrationDate: string;
    declare isAvailableForWork: boolean;
    declare isActive: boolean;

    declare idStore: CreationOptional<ForeignKey<Store["id"]>>;
    declare idPosition: ForeignKey<EmployeePosition["id"]>;
    declare workplace?: NonAttribute<Store>;
    declare position?: NonAttribute<EmployeePosition>;

    declare static associations: {
        workplace: Association<Employee, Store>;
        position: Association<Employee, EmployeePosition>;
    };

    static associate(models: IDB) {
        Employee.belongsTo(models.Store, {
            foreignKey: "idSucursal",
            as: "workplace"
        });
        Employee.belongsTo(models.EmployeePosition, {
            foreignKey: "idCargoTrabajador",
            as: "position"
        });
    }
}