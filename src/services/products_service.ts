import { Op, InferAttributes, Sequelize } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import { IProductWithInventory} from "../types/interfaces/response_bodies";
import { IProductWithCategory } from "../types/interfaces/response_bodies";
import Inventory from "../models/Inventory";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { CreateProductErrorCodes } from "../types/enums/error_codes";
import { IInventoryWithOptionalProductId } from "../types/interfaces/request_bodies";

async function getProductsInStore(idStore: number, pagination: { offset: number, limit: number, query: string, categoryFilter?: number }) {
    const productsList: IProductWithInventory[] = [];

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

        inventories.forEach(inventory => {
            const productInfo = { 
                ...inventory.product!.toJSON(), 
                inventory 
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

async function getAllProducts(pagination: { offset: number, limit: number }) {
    const productsList: IProductWithCategory[] = [];

    try {
        const { offset, limit } = pagination;

        const products = await db.Product.findAll({
            include: [ {
                association: db.Product.associations.category
            }],
            limit,
            offset
        });

        products.forEach(product => {
            const productInfo = {
                ...product.toJSON(),
                category: product.category!
            }
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

async function getProductInventoriesByIdProduct(idProduct: number) {
    const inventoriesList: InferAttributes<Inventory>[] = [];

    try {
        const product = await db.Product.findByPk(idProduct);

        if (product === null) {
            throw new BusinessLogicException(ErrorMessages.PRODUCT_NOT_FOUND);
        }

        const inventories = await db.Inventory.findAll({
            where: {
                idProduct
            }
        });

        inventories.forEach(inventory => {
            inventoriesList.push({
                ...inventory.toJSON()
            });
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return inventoriesList;
}

async function createProductWithInventories(
    product: { 
        barCode: string, 
        name: string, 
        description: string,
        salePrice: number,
        imageUrl: string,
        maximumAmount: number,
        idCategory: number
        inventories?: IInventoryWithOptionalProductId[]}
    ) {

    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();
    
    try {
        const {
            barCode,
            name,
            description,
            salePrice,
            imageUrl,
            maximumAmount,
            idCategory,
            inventories
        } = product;

        const productWithSameBarCode = await db.Product.findOne({
            where: {
                barCode
            }
        });

        if (productWithSameBarCode !== null) {
            throw new BusinessLogicException(
                ErrorMessages.BAR_CODE_ALREADY_EXISTS, 
                CreateProductErrorCodes.BAR_CODE_ALREADY_EXISTS
            );
        }

        const productCategory = await db.ProductCategory.findByPk(idCategory);

        if (productCategory === null) {
            throw new BusinessLogicException(
                ErrorMessages.PRODUCT_CATEGORY_NOT_FOUND, 
                CreateProductErrorCodes.PRODUCT_CATEGORY_NOT_FOUND
            );
        }
        const productInDB = await db.Product.create({
            barCode,
            name,
            description,
            salePrice,
            maximumAmount,
            imageUrl,
            isActive: true,
            idCategory
        },
        {
            transaction
        });

        if (inventories) {
            for (const inventory of inventories) {
                await db.Inventory.create({
                    idProduct: productInDB.id,
                    idStore: inventory.idStore,
                    expirationDate: inventory.expirationDate,
                    stock: inventory.stock,
                },
                {
                    transaction
                });
            }
        }        

        await transaction.commit();
    } catch (error: any) {
        await transaction.rollback();
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

export {
    getProductsInStore,
    getAllProducts,
    getProductInventoriesByIdProduct,
    createProductWithInventories
}