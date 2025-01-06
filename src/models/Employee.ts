import { Association, CreationOptional, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Store from "./Store";
import { IDB } from "../types/interfaces/db";
import EmployeePosition from "./EmployeePosition";
import Order from "./Order";

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
    declare orders?: NonAttribute<Order[]>;

    declare getOrders: HasManyGetAssociationsMixin<Order>;
    declare addOrder: HasManyAddAssociationMixin<Order, number>;
    declare addOrders: HasManyAddAssociationsMixin<Order, number>;
    declare setOrders: HasManySetAssociationsMixin<Order, number>;
    declare removeOrder: HasManyRemoveAssociationMixin<Order, number>;
    declare removeOrders: HasManyRemoveAssociationsMixin<Order, number>;
    declare hasOrder: HasManyHasAssociationMixin<Order, number>;
    declare hasOrders: HasManyHasAssociationsMixin<Order, number>;
    declare countOrders: HasManyCountAssociationsMixin;
    declare createOrder: HasManyCreateAssociationMixin<Order, "idDeliveryMan">;

    declare static associations: {
        workplace: Association<Employee, Store>;
        position: Association<Employee, EmployeePosition>;
        orders: Association<Employee, Order>;
    };

    static associate(models: IDB) {
        Employee.hasMany(models.Order, {
            foreignKey: "idTrabajador",
            as: "orders"
        });
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