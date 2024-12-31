import { Op, InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import {
    IProductByIdWithStock,
    IProductWithInventory,
    IProductWithStock,
} from "../types/interfaces/response_bodies";
import { IProduct } from "../types/interfaces/response_bodies";
import Inventory from "../models/Inventory";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import {
    CreateProductErrorCodes,
    GetStoreInventoriesErrorCodes,
    GetProductWithStockInStoreErrorCodes,
    UpdateProductErrorCodes,
    GetProductErrorCodes,
} from "../types/enums/error_codes";
import { IInventoryWithOptionalProductIdBody } from "../types/interfaces/request_bodies";
import Product from "../models/Product";
import { HttpStatusCodes } from "../types/enums/http";

async function getProductsInStore(
    idStore: number,
    pagination: {
        offset: number;
        limit: number;
        query: string;
        categoryFilter?: number;
    }
) {
    const productsList: IProductWithInventory[] = [];

    try {
        const { offset, limit, query, categoryFilter } = pagination;
        const inventories = await db.Inventory.findAll({
            where: { idStore },
            include: [
                {
                    association: db.Inventory.associations.product,
                    where: {
                        isActive: true,
                        ...(categoryFilter
                            ? { idCategory: categoryFilter }
                            : {}),
                        ...(query
                            ? {
                                  [Op.or]: [
                                      { name: { [Op.like]: `%${query}%` } },
                                      {
                                          description: {
                                              [Op.like]: `%${query}%`,
                                          },
                                      },
                                  ],
                              }
                            : {}),
                    },
                    required: true,
                },
            ],
            limit,
            offset,
            subQuery: false,
            order: [[db.Inventory.associations.product, "id", "DESC"]],
        });

        inventories.forEach((inventory) => {
            const productInfo = {
                ...inventory.product!.toJSON(),
                inventory,
            };
            productsList.push(productInfo);
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productsList;
}

async function getAllProducts(pagination: { offset: number; limit: number }) {
    const productsList: IProduct[] = [];

    try {
        const { offset, limit } = pagination;

        const products = await db.Product.findAll({
            limit,
            offset,
        });

        products.forEach((product) => {
            productsList.push({
                id: product.id,
                barCode: product.barCode,
                name: product.name,
                imageUrl: product.imageUrl,
            });
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productsList;
}

async function getProduct(barCode: string) {
    let productInfo: InferAttributes<Product> | null = null;
    try {
        const product = await db.Product.findOne({
            where: { barCode },
        });

        if (product === null) {
            throw new BusinessLogicException(
                ErrorMessages.PRODUCT_NOT_FOUND,
                GetProductErrorCodes.PRODUCT_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        productInfo = { ...product.toJSON() };
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productInfo;
}

async function getProductWithStockInStore(barCode: string, idStore: number) {
    let productWithStock: IProductWithStock | null = null;

    try {
        const existingProduct = await db.Product.findOne({
            where: { barCode },
        });

        if (existingProduct === null) {
            throw new BusinessLogicException(
                ErrorMessages.PRODUCT_NOT_FOUND,
                GetProductWithStockInStoreErrorCodes.PRODUCT_NOT_FOUND
            );
        }

        const existingStore = await db.Store.findByPk(idStore);

        if (existingStore === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                GetProductWithStockInStoreErrorCodes.STORE_NOT_FOUND
            );
        }

        const productWithStockDB = await db.Inventory.findOne({
            where: { idProduct: existingProduct.id, idStore },
            include: [
                {
                    association: db.Inventory.associations.product,
                },
            ],
        });

        if (productWithStockDB === null) {
            throw new BusinessLogicException(
                ErrorMessages.INVENTORY_DOES_NOT_EXIST,
                GetProductWithStockInStoreErrorCodes.INVENTORY_DOES_NOT_EXIST
            );
        }

        productWithStock = {
            ...productWithStockDB?.product!.toJSON(),
            stock: productWithStockDB?.stock!,
        };
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return productWithStock;
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
                idProduct,
            },
        });

        inventories.forEach((inventory) => {
            inventoriesList.push({
                ...inventory.toJSON(),
            });
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return inventoriesList;
}

async function createProductWithInventories(product: {
    barCode: string;
    name: string;
    description: string;
    salePrice: number;
    imageUrl: string;
    maximumAmount: number;
    idCategory: number;
    inventories?: IInventoryWithOptionalProductIdBody[];
}) {
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
            inventories,
        } = product;

        const productWithSameBarCode = await db.Product.findOne({
            where: {
                barCode,
            },
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
        const productInDB = await db.Product.create(
            {
                barCode,
                name,
                description,
                salePrice,
                maximumAmount,
                imageUrl,
                isActive: true,
                idCategory,
            },
            {
                transaction,
            }
        );

        if (inventories) {
            for (const inventory of inventories) {
                await db.Inventory.create(
                    {
                        idProduct: productInDB.id,
                        idStore: inventory.idStore,
                        expirationDate: inventory.expirationDate,
                        stock: inventory.stock,
                    },
                    {
                        transaction,
                    }
                );
            }
        }

        await transaction.commit();
    } catch (error: any) {
        await transaction.rollback();
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function updateProductWithInventories(product: {
    idProduct: number;
    name: string;
    description: string;
    salePrice: number;
    imageUrl: string;
    maximumAmount: number;
    isActive: boolean;
    idCategory: number;
    inventories?: IInventoryWithOptionalProductIdBody[];
}) {
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
        const {
            idProduct,
            name,
            description,
            salePrice,
            imageUrl,
            maximumAmount,
            isActive,
            idCategory,
            inventories,
        } = product;

        const existingProduct = await db.Product.findByPk(idProduct);

        if (existingProduct === null) {
            throw new BusinessLogicException(
                ErrorMessages.PRODUCT_NOT_FOUND,
                UpdateProductErrorCodes.PRODUCT_NOT_FOUND
            );
        }

        const productCategory = await db.ProductCategory.findByPk(idCategory);

        if (productCategory === null) {
            throw new BusinessLogicException(
                ErrorMessages.PRODUCT_CATEGORY_NOT_FOUND,
                UpdateProductErrorCodes.PRODUCT_CATEGORY_NOT_FOUND
            );
        }

        await db.Product.update(
            {
                name,
                description,
                salePrice,
                maximumAmount,
                imageUrl,
                isActive,
                idCategory,
            },
            {
                where: {
                    id: idProduct,
                },
                transaction,
            }
        );

        if (inventories) {
            for (const inventory of inventories) {
                if (inventory.id) {
                    const existingInventory = await db.Inventory.findByPk(
                        inventory.id
                    );

                    if (existingInventory === null) {
                        throw new BusinessLogicException(
                            ErrorMessages.INVENTORY_NOT_FOUND,
                            UpdateProductErrorCodes.INVENTORY_NOT_FOUND
                        );
                    }

                    await db.Inventory.update(
                        {
                            expirationDate: inventory.expirationDate,
                            stock: inventory.stock,
                        },
                        {
                            where: {
                                id: inventory.id,
                            },
                            transaction,
                        }
                    );
                } else {
                    await db.Inventory.create(
                        {
                            idProduct: idProduct,
                            idStore: inventory.idStore,
                            expirationDate: inventory.expirationDate,
                            stock: inventory.stock,
                        },
                        {
                            transaction,
                        }
                    );
                }
            }
        }

        await transaction.commit();
    } catch (error: any) {
        await transaction.rollback();
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getStoreInventories(idStore: number, productsId: number[]) {
    const inventoriesList: IProductByIdWithStock[] = [];

    try {
        const store = await db.Store.findByPk(idStore);

        if (store === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                GetStoreInventoriesErrorCodes.STORE_NOT_FOUND
            );
        }

        for (const idProduct of productsId) {
            const product = await db.Product.findByPk(idProduct);

            if (product === null) {
                throw new BusinessLogicException(
                    ErrorMessages.PRODUCT_NOT_FOUND,
                    GetStoreInventoriesErrorCodes.PRODUCT_NOT_FOUND
                );
            }

            const inventory = await db.Inventory.findOne({
                where: {
                    idProduct,
                    idStore,
                },
            });

            if (inventory === null) {
                throw new BusinessLogicException(
                    ErrorMessages.INVENTORY_DOES_NOT_EXIST,
                    GetStoreInventoriesErrorCodes.INVENTORY_DOES_NOT_EXIST
                );
            }

            const inventoriesInfo = {
                idProduct,
                stock: inventory?.stock,
            };

            inventoriesList.push(inventoriesInfo);
        }
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return inventoriesList;
}

export {
    getProductsInStore,
    getAllProducts,
    getProduct,
    getProductInventoriesByIdProduct,
    getProductWithStockInStore,
    createProductWithInventories,
    updateProductWithInventories,
    getStoreInventories,
};
