import { DataTypes, Sequelize } from "sequelize";
import Incident from "../Incident";

export default (sequelize: Sequelize) => {
    Incident.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idIncidencia"
        },
        creationDate: {
            type: DataTypes.DATE,
            field: "fechaCreacion",
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING(255),
            field: "motivo",
            allowNull: false
        },
        idOrder: {
            type: DataTypes.INTEGER,
            field: "idPedido"
        }
    }, {
        sequelize,
        tableName: "Incidencias",
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["idPedido"] }
        }
    });

    return Incident;
}