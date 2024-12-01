import { DataTypes, Sequelize } from "sequelize";
import OrderProduct from "../OrderProduct";

export default (sequelize: Sequelize) => {
    OrderProduct.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idPedidoProducto"
        },
        amount: {
            type: DataTypes.INTEGER,
            field: "cantidad",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "PedidosProductos",
        timestamps: false
    });

    return OrderProduct;
}