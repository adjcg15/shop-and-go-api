import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductsInStore, getStoreInventories } from "../services/products_service";
import { getStores } from "../services/stores_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import { IStoreByIdParams } from "../types/interfaces/request_parameters";
import { IProductByIdWithStock, IProductWithInventory} from "../types/interfaces/response_bodies";
import Store from "../models/Store";
import { ICoordinatesBody, IProductsByIdBody } from "../types/interfaces/request_bodies";
import { findNearestStore, validateNearestStoreDistance } from "../../utils/store_utils";

async function getProductsInStoreController(
    req: Request<IStoreByIdParams, {}, {}, IProductsListPaginationQuery>, 
    res: Response<IProductWithInventory[]>, 
    next: NextFunction
) {
    try {
        const { limit, offset, query, categoryFilter } = req.query;
        const { idStore } = req.params;

        const products = await getProductsInStore(
            idStore!,
            { limit: limit!, offset: offset!, query: query!, categoryFilter }
        );
        
        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
}

async function getStoresController(req: Request, res: Response<InferAttributes<Store>[]>, next: NextFunction) {
    try {
        const stores = await getStores();

        res.status(HttpStatusCodes.OK).json(stores);
    } catch (error) {
        next(error);
    }
}

async function getStoreInventoriesController(
    req: Request<IStoreByIdParams, {}, IProductsByIdBody, {}>, 
    res: Response<IProductByIdWithStock[]>, 
    next: NextFunction
) {
    try {
        const { idStore } = req.params;
        const { productsId } = req.body;

        const inventories = await getStoreInventories(idStore!, productsId!);

        res.status(HttpStatusCodes.OK).json(inventories);
    } catch (error) {
        next(error);
    }
}

async function getNearestStoreController(
    req: Request<{}, {}, ICoordinatesBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const stores = await getStores();
        const { latitude, longitude } = req.body;

        if (stores.length === 0) {
            res.status(HttpStatusCodes.NOT_FOUND).json();
        } else {
            const nearestStoreResult = findNearestStore(
                latitude!,
                longitude!,
                stores
            );

            validateNearestStoreDistance(nearestStoreResult!.minDistance);

            res.status(HttpStatusCodes.OK).json(nearestStoreResult!.nearestStore);
        }
    } catch (error) {
        next(error);
    }
}

export {
    getProductsInStoreController,
    getStoresController,
    getStoreInventoriesController,
    getNearestStoreController
};