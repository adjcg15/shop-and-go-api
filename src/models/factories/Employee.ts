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
            type: DataTypes.DATE,
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
        }
    }, {
        sequelize,
        tableName: "Trabajadores",
        timestamps: false
    });

    return Employee;
}