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
        }
    }, {
        sequelize,
        tableName: "Inventarios",
        timestamps: false
    });

    return Inventory;
}