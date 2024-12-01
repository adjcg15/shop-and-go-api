import Address from "../Address";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Address.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idDireccionEntrega"
        },
        street: {
            type: DataTypes.STRING(255),
            field: "calle",
            allowNull: false
        },
        streetNumber: {
            type: DataTypes.STRING(5),
            field: "numeroExterior",
            allowNull: false
        },
        apartmentNumber: {
            type: DataTypes.STRING(5),
            field: "numeroInterior",
            allowNull: true
        },
        neighborhood: {
            type: DataTypes.STRING(255),
            field: "colonia",
            allowNull: false
        },
        municipality: {
            type: DataTypes.STRING(255),
            field: "municipio",
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(255),
            field: "ciudad",
            allowNull: false
        },
        postalCode: {
            type: DataTypes.CHAR(5),
            field: "codigoPostal",
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(255),
            field: "codigoPostal",
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
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "esActivo",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "DireccionesEntrega",
        timestamps: false
    });

    return Address;
}