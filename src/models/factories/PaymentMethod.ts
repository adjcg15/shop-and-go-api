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
        cvcCode: {
            type: DataTypes.CHAR(3),
            field: "codigoSeguridad",
            allowNull: false
        },
        cardNumber: {
            type: DataTypes.CHAR(16),
            field: "numeroTarjeta",
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
        }
    }, {
        sequelize,
        tableName: "MetodosPago",
        timestamps: false
    });

    return PaymentMethod;
}