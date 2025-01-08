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
        },
        idOrder: {
            type: DataTypes.INTEGER,
            field: "idPedido"
        },
        idProduct: {
            type: DataTypes.INTEGER,
            field: "idProducto"
        }
    }, {
        sequelize,
        tableName: "PedidosProductos",
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["idPedido", "idProducto"] }
        }
    });

    return OrderProduct;
}