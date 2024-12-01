import Issuer from "../Issuer";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Issuer.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idEmisor"
        },
        name: {
            type: DataTypes.STRING(64),
            field: "nombre",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "EmisoresMetodosPago",
        timestamps: false
    });

    return Issuer;
}