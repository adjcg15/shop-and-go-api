import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import {
    getProductsInStore,
    getProductWithStockInStore,
    getStoreInventories,
} from "../services/products_service";
import { createStore, getStore, getStores, updateStore } from "../services/stores_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import {
    IProductByBarCodeParams,
    IStoreByIdParams,
} from "../types/interfaces/request_parameters";
import {
    IProductByIdWithStock,
    IProductWithInventory,
    IProductWithStock,
} from "../types/interfaces/response_bodies";
import Store from "../models/Store";
import {
    ICoordinatesBody,
    IProductsByIdBody,
} from "../types/interfaces/request_bodies";
import {
    findNearestStore,
    validateNearestStoreDistance,
} from "../lib/distance_service";
import UserRoles from "../types/enums/user_roles";

async function updateStoreController(
    req: Request<IStoreByIdParams, {}, Omit<InferAttributes<Store>, "id">, {}>,
    res: Response,
    next: NextFunction
) {
    const { idStore } = req.params;
    const store = req.body;

    try {
        const updatedStore = await updateStore({
            id: idStore!,
            ...store,
        });
        res.status(HttpStatusCodes.OK).json(updatedStore);
    } catch (error) {
        next(error);
    }
}

async function createStoreController(
    req: Request<{}, {}, Omit<InferAttributes<Store>, "id">, {}>,
    res: Response,
    next: NextFunction
) {
    const storeInfo = req.body;

    try {
        const newStore = await createStore(storeInfo);
        res.status(HttpStatusCodes.CREATED).json(newStore);
    } catch (error) {
        next(error);
    }
}

async function getProductsInStoreController(
    req: Request<IStoreByIdParams, {}, {}, IProductsListPaginationQuery>,
    res: Response<IProductWithInventory[]>,
    next: NextFunction
) {
    try {
        const user = req.user;
        const includeInactiveProducts =
            user?.userRole === UserRoles.SALES_EXECUTIVE;
        const { limit, offset, query, categoryFilter } = req.query;
        const { idStore } = req.params;

        const products = await getProductsInStore(
            idStore!,
            {
                limit: limit!,
                offset: offset!,
                query: query!,
                categoryFilter,
            },
            includeInactiveProducts
        );

        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
}

async function getProductWithStockInStoreController(
    req: Request<IProductByBarCodeParams & IStoreByIdParams, {}, {}, {}>,
    res: Response<IProductWithStock>,
    next: NextFunction
) {
    try {
        const { barCode, idStore } = req.params;

        const product = await getProductWithStockInStore(barCode!, idStore!);

        res.status(HttpStatusCodes.OK).json(product);
    } catch (error) {
        next(error);
    }
}

async function getStoresController(
    req: Request,
    res: Response<InferAttributes<Store>[]>,
    next: NextFunction
) {
    try {
        const stores = await getStores();

        res.status(HttpStatusCodes.OK).json(stores);
    } catch (error) {
        next(error);
    }
}

async function getStoreController(
    req: Request<IStoreByIdParams, {}, {}, {}>,
    res: Response<InferAttributes<Store>>,
    next: NextFunction
) {
    try {
        const { idStore } = req.params;

        const store = await getStore(idStore!);

        res.status(HttpStatusCodes.OK).json(store);
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

            res.status(HttpStatusCodes.OK).json(
                nearestStoreResult!.nearestStore
            );
        }
    } catch (error) {
        next(error);
    }
}

export {
    getProductsInStoreController,
    getStoresController,
    getStoreController,
    getProductWithStockInStoreController,
    getStoreInventoriesController,
    getNearestStoreController,
    updateStoreController,
    createStoreController
};
