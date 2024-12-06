import { Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import { IProductWithStock, IProductCategory } from "../types/interfaces/response_bodies";
import ProductCategory from "../models/ProductCategory";

async function getProductsInStore(idStore: number, pagination: { offset: number, limit: number, query: string, categoryFilter?: number }) {
    const productsList: IProductWithStock[] = [];

    try {
        const { offset, limit, query, categoryFilter } = pagination;
        //TODO: ordenar por popularidad
        const inventories = await db.Inventory.findAll({
            where: { idStore },
            include: [
                {
                    association: db.Inventory.associations.product,
                    where: {
                        ...(categoryFilter ? { idCategory: categoryFilter } : {}),
                        ...(query
                            ? {
                                [Op.or]: [
                                    { name: { [Op.like]: `%${query}%` } },
                                    { description: { [Op.like]: `%${query}%` } },
                                ],
                            }
                            : {}
                        )
                    }
                },
            ],
            limit,
            offset,
            subQuery: true
        });

        inventories.forEach(({stock, product}) => {
            const productInfo = { 
                ...product!.toJSON(), 
                stock 
            };
            productsList.push(productInfo);
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productsList;
}

async function getProductCategories() {
    const productCategoriesList: IProductCategory[] = [];
    try {
        const productCategories = await ProductCategory.findAll({
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
    getProductsInStore,
    getProductCategories
}