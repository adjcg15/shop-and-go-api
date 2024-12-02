import { Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import { IProductWithStock } from "../types/interfaces/response_bodies";

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

export {
    getProductsInStore
}