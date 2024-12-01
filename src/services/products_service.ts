import { InferAttributes, Op } from "sequelize";
import db from "../models";
import Product from "../models/Product";
import SQLException from "../exceptions/services/SQLException";

async function getProductsInStore(idStore: number, pagination: { offset: number, limit: number, query: string, categoryFilter?: number }) {
    const productsList: (InferAttributes<Product> & { stock: number })[] = [];

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