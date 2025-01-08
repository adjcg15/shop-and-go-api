import { getTimeOnMSQLFormat } from "../../lib/datetime_service";
import Store from "../Store";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Store.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idSucursal"
        },
        name: {
            type: DataTypes.STRING(255),
            field: "nombreComercial",
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING(255),
            field: "direccionCompleta",
            allowNull: false
        },
        openingTime: {
            type: DataTypes.TIME,
            field: "horaApertura",
            allowNull: false,
            get() {
                const rawValue = this.getDataValue("openingTime");
                if(typeof rawValue !== "string") {
                    const openingDate = new Date(rawValue);
                    return getTimeOnMSQLFormat(openingDate);
                }
                
                return rawValue;
            }
        },
        closingTime: {
            type: DataTypes.TIME,
            field: "horaCierre",
            allowNull: false,
            get() {
                const rawValue = this.getDataValue("closingTime");
                if(typeof rawValue !== "string") {
                    const closingDate = new Date(rawValue);
                    return getTimeOnMSQLFormat(closingDate);
                }
                
                return rawValue;
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            field: "latitud",
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            field: "longitud",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "Sucursales",
        timestamps: false
    });

    return Store;
}