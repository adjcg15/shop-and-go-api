import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import ProductCategory from "../models/ProductCategory";

async function getProductCategories() {
    const productCategoriesList: InferAttributes<ProductCategory>[] = [];
    try {
        const productCategories = await db.ProductCategory.findAll({
            where: {
                isActive: true
            }
        });

        productCategories.forEach(productCategory => {
            const productCategoryInfo = {
                ...productCategory!.toJSON()
            }
            productCategoriesList.push(productCategoryInfo);
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productCategoriesList;
}

export {
    getProductCategories
}