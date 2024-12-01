import Employee from "../Employee";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Employee.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idTrabajador"
        },
        fullName: {
            type: DataTypes.STRING(255),
            field: "nombreCompleto",
            allowNull: false
        },
        user: {
            type: DataTypes.STRING(50),
            field: "usuario",
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.CHAR(64),
            field: "contrasena",
            allowNull: false
        },
        registrationDate: {
            type: DataTypes.DATEONLY,
            field: "fechaIngreso",
            allowNull: false
        },
        isAvailableForWork: {
            type: DataTypes.BOOLEAN,
            field: "disponible",
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "esActivo",
            allowNull: false
        },
        idStore: {
            type: DataTypes.INTEGER,
            field: "idSucursal"
        },
        idPosition: {
            type: DataTypes.INTEGER,
            field: "idCargoTrabajador"
        }
    }, {
        sequelize,
        tableName: "Trabajadores",
        timestamps: false
    });

    return Employee;
}