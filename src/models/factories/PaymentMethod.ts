import PaymentMethod from "../PaymentMethod";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    PaymentMethod.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idMetodoPago"
        },
        expirationYear: {
            type: DataTypes.INTEGER,
            field: "anioVencimiento",
            allowNull: false
        },
        expirationMonth: {
            type: DataTypes.INTEGER,
            field: "mesVencimiento",
            allowNull: false
        },
        encryptedCardNumber: {
            type: DataTypes.CHAR(32),
            field: "numeroTarjetaEncriptado",
            allowNull: false
        },
        hashedCardNumber: {
            type: DataTypes.CHAR(60),
            field: "numeroTarjetaHasheado",
            allowNull: false
        },
        initialVector: {
            type: DataTypes.CHAR(24),
            field: "vectorInicializacion",
            allowNull: false
        },
        authenticationTag: {
            type: DataTypes.CHAR(32),
            field: "etiquetaAutenticacion",
            allowNull: false
        },
        cardholderName: {
            type: DataTypes.STRING(64),
            field: "nombreTitular",
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "esActivo",
            allowNull: false
        },
        idIssuer: {
            type: DataTypes.INTEGER,
            field: "idEmisor"
        },
        idClient: {
            type: DataTypes.INTEGER,
            field: "idCliente"
        }
    }, {
        sequelize,
        tableName: "MetodosPago",
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["idEmisor", "idCliente"] }
        }
    });

    return PaymentMethod;
}