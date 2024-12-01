import Client from "../Client";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Client.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idCliente"
        },
        passwordHash: {
            type: DataTypes.CHAR(64),
            field: "contrasena",
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE,
            field: "fechaNacimiento",
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING(64),
            field: "nombreCompleto",
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.CHAR(10),
            field: "numeroTelefono",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "Clientes",
        timestamps: false
    });

    return Client;
}