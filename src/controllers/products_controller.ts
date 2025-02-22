import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import {
    createProductWithInventories,
    getAllProducts,
    getProduct,
    getProductInventoriesByIdProduct,
    updateProductWithInventories,
} from "../services/products_service";
import {
    IProductByBarCodeParams,
    IProductByIdParams,
} from "../types/interfaces/request_parameters";
import { InferAttributes } from "sequelize";
import Inventory from "../models/Inventory";
import { IProductWithInventoriesBody } from "../types/interfaces/request_bodies";
import Product from "../models/Product";

async function getAllProductsController(
    req: Request<{}, {}, {}, IPaginationQuery>,
    res: Response<InferAttributes<Product>[]>,
    next: NextFunction
) {
    try {
        const { limit, offset } = req.query;

        const products = await getAllProducts({
            limit: limit!,
            offset: offset!,
        });
        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
}

async function getProductController(
    req: Request<IProductByBarCodeParams, {}, {}, {}>,
    res: Response<InferAttributes<Product>>,
    next: NextFunction
) {
    try {
        const { barCode } = req.params;

        const product = await getProduct(barCode!);

        res.status(HttpStatusCodes.OK).json(product);
    } catch (error) {
        next(error);
    }
}

async function getProductInventoriesByIdProductController(
    req: Request<IProductByIdParams, {}, {}, {}>,
    res: Response<InferAttributes<Inventory>[]>,
    next: NextFunction
) {
    try {
        const { idProduct } = req.params;

        const inventories = await getProductInventoriesByIdProduct(idProduct!);
        res.status(HttpStatusCodes.OK).json(inventories);
    } catch (error) {
        next(error);
    }
}

async function createProductWithInventoriesController(
    req: Request<{}, {}, IProductWithInventoriesBody, {}>,
    res: Response,
    next: NextFunction
) {
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
        } = req.body;

        await createProductWithInventories({
            barCode: barCode!,
            name,
            description,
            salePrice,
            imageUrl,
            maximumAmount,
            idCategory,
            inventories,
        });

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

async function updateProductWithInventoriesController(
    req: Request<IProductByIdParams, {}, IProductWithInventoriesBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const {
            name,
            description,
            salePrice,
            imageUrl,
            maximumAmount,
            isActive,
            idCategory,
            inventories,
        } = req.body;
        const { idProduct } = req.params;

        await updateProductWithInventories({
            idProduct: idProduct!,
            name,
            description,
            salePrice,
            imageUrl,
            maximumAmount,
            isActive: isActive!,
            idCategory,
            inventories,
        });

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

export {
    getAllProductsController,
    getProductController,
    getProductInventoriesByIdProductController,
    createProductWithInventoriesController,
    updateProductWithInventoriesController,
};
