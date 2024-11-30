import ProductCategory from "../ProductCategory";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    ProductCategory.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idCategoria"
        },
        name: {
            type: DataTypes.STRING,
            field: "nombre",
            allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "esActiva",
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "Categorias",
        timestamps: false
    });

    return ProductCategory;
}