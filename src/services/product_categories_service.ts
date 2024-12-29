import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import ProductCategory from "../models/ProductCategory";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { HttpStatusCodes } from "../types/enums/http";
import { UniqueConstraintError } from "sequelize";

async function getProductCategories(includeInactive: boolean = false) {
    const productCategoriesList: InferAttributes<ProductCategory>[] = [];
    try {
        const productCategories = await db.ProductCategory.findAll({
            where: includeInactive ? {} : { isActive: true },
            order: [["name", "ASC"]]
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

async function updateProductCategory(idCategory: number, updatedInfo: Partial<Omit<InferAttributes<ProductCategory>, "id">>) {
    let updatedCategory = null;

    try {
        const mapOfCategoryFieldsWithValues = Object.entries(updatedInfo).filter(([_, value]) => value !== undefined);
        if(mapOfCategoryFieldsWithValues.length > 0) {
           updatedInfo = Object.fromEntries(mapOfCategoryFieldsWithValues);

            const storedProductCategory = await db.ProductCategory.findByPk(idCategory);
            if(!storedProductCategory) {
                throw new BusinessLogicException(
                    ErrorMessages.PRODUCT_CATEGORY_NOT_FOUND, 
                    undefined, 
                    HttpStatusCodes.NOT_FOUND
                );
            }

            await storedProductCategory.update(updatedInfo);
            updatedCategory = storedProductCategory.toJSON();
        }
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return updatedCategory;
}

async function createProductCategory(categoryInfo: Omit<InferAttributes<ProductCategory>, "id">) {
    let createdCategory = null;

    try {
        const dbCategory = await db.ProductCategory.create(categoryInfo);
        createdCategory = dbCategory.toJSON();
    } catch (error: any) {
        if(error instanceof UniqueConstraintError) {
            throw new BusinessLogicException(ErrorMessages.DUPLICATED_PRODUCT_CATEGORY);
        } else {
            throw new SQLException(error);
        }
    }

    return createdCategory;
}

export {
    getProductCategories,
    updateProductCategory,
    createProductCategory
}