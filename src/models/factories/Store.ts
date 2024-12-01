import Store from "../Store";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Store.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idSucursal"
        },
        name: {
            type: DataTypes.STRING(255),
            field: "nombreComercial",
            allowNull: false,
            unique: true
        },
        completeAddress: {
            type: DataTypes.STRING(255),
            field: "direccionCompleta",
            allowNull: false
        },
        openingTime: {
            type: DataTypes.TIME,
            field: "horaApertura",
            allowNull: false
        },
        closingTime: {
            type: DataTypes.TIME,
            field: "horaApertura",
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            field: "latitud",
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            field: "longitud",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "Sucursales",
        timestamps: false
    });

    return Store;
}