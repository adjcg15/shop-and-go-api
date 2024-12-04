import Inventory from "../Inventory";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Inventory.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idInventario"
        },
        stock: {
            type: DataTypes.INTEGER,
            field: "cantidad",
            allowNull: false
        },
        expirationDate: {
            type: DataTypes.DATEONLY,
            field: "fechaCaducidad",
            allowNull: false
        },
        idProduct: {
            type: DataTypes.INTEGER,
            field: "idProducto"
        },
        idStore: {
            type: DataTypes.INTEGER,
            field: "idSucursal"
        }
    }, {
        sequelize,
        tableName: "Inventarios",
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["idProducto", "idSucursal"] }
        }
    });

    return Inventory;
}