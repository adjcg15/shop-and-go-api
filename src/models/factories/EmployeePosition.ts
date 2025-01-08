import EmployeePosition from "../EmployeePosition";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    EmployeePosition.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idCargoTrabajador"
        },
        title: {
            type: DataTypes.STRING(50),
            field: "nombre",
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName: "CargosTrabajador",
        timestamps: false
    });

    return EmployeePosition;
}