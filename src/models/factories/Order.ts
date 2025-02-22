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
            type: DataTypes.STRING,
            field: "fechaSolicitud",
            allowNull: false
        },
        deliveryDate: {
            type: DataTypes.STRING,
            field: "fechaEntrega",
            allowNull: true
        },
        idStatus: {
            type: DataTypes.INTEGER,
            field: "idEstadoPedido"
        },
        idDeliveryAddress: {
            type: DataTypes.INTEGER,
            field: "idDireccionEntrega"
        },
        idClient: {
            type: DataTypes.INTEGER,
            field: "idCliente"
        },
        idPaymentMethod: {
            type: DataTypes.INTEGER,
            field: "idMetodoPago"
        },
        idStore: {
            type: DataTypes.INTEGER,
            field: "idSucursal"
        },
        idDeliveryMan: {
            type: DataTypes.INTEGER,
            field: "idTrabajador"
        }
    }, {
        sequelize,
        tableName: "Pedidos",
        timestamps: false,
        defaultScope: {
            attributes: { 
                exclude: ["idEstadoPedido", "idDireccionEntrega", "idCliente", "idMetodoPago", "idSucursal", "idTrabajador"] 
            }
        }
    });

    return Order;
}