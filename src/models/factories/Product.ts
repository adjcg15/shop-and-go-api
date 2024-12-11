import Product from "../Product";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: "idProducto"
        },
        barCode: {
            type: DataTypes.CHAR(13),
            unique: true,
            field: "codigoBarras",
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            field: "nombre",
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            field: "descripcion",
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.TEXT,
            field: "urlImagen",
            allowNull: false
        },
        salePrice: {
            type: DataTypes.DECIMAL(19, 4),
            field: "precioVenta",
            allowNull: false
        },
        maximumAmount: {
            type: DataTypes.INTEGER,
            field: "cantidadMaxima",
            allowNull: false
        },
        idCategory: {
            type: DataTypes.INTEGER,
            field: "idCategoria"
        }
    }, {
        sequelize,
        tableName: "Productos",
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["idCategoria"] }
        }
    });

    return Product;
}