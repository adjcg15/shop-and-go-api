import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductsInStore, getProductCategories } from "../services/products_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import { IStoreByIdParams } from "../types/interfaces/request_parameters";
import { IProductWithStock, IProductCategory } from "../types/interfaces/response_bodies";

async function getProductsInStoreController(
    req: Request<IStoreByIdParams, {}, {}, IProductsListPaginationQuery>, 
    res: Response<IProductWithStock[]>, 
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

async function getProductCategoriesController(req: Request, res: Response<IProductCategory[]>, next: NextFunction) {
    try {
        const productCategories = await getProductCategories();
        res.status(HttpStatusCodes.OK).json(productCategories);
    } catch (error) {
        next(error);
    }
}

export {
    getProductsInStoreController,
    getProductCategoriesController
};