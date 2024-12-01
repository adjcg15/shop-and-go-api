import { DataTypes, Sequelize } from "sequelize";
import Order from "../Order";

export default (sequelize: Sequelize) => {
    Order.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idPedido"
        },
        dateOfPurchase: {
            type: DataTypes.DATE,
            field: "fechaSolicitud",
            allowNull: false
        },
        deliveryDate: {
            type: DataTypes.DATE,
            field: "fechaEntrega",
            allowNull: true
        }
    }, {
        sequelize,
        tableName: "Pedidos",
        timestamps: false
    });

    return Order;
}