import { DataTypes, Sequelize } from "sequelize";
import OrderStatus from "../OrderStatus";

export default (sequelize: Sequelize) => {
    OrderStatus.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idEstadoPedido"
        },
        title: {
            type: DataTypes.STRING(50),
            field: "nombre",
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName: "EstadosPedido",
        timestamps: false
    });

    return OrderStatus;
}