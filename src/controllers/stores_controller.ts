import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductsInStore } from "../services/products_service";
import { getStores } from "../services/stores_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import { IStoreByIdParams } from "../types/interfaces/request_parameters";
import { IProductWithInventory} from "../types/interfaces/response_bodies";
import Store from "../models/Store";

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

export {
    getProductsInStoreController,
    getStoresController
};