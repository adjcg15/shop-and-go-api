import { NextFunction, Request, Response } from "express";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";

function injectDefaultGetProductsInStoreQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    const MAX_PRODUCTS_BATCH_SIZE = 12;
    const query = req.query as IProductsListPaginationQuery;

    if(!query.limit) {
        query.limit = MAX_PRODUCTS_BATCH_SIZE;
    }

    if(!query.offset) {
        query.offset = 0;
    }

    if(!query.query) {
        query.query = "";
    }

    next();
}

function injectDefaultGetProductsQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    const MAX_PRODUCTS_BATCH_SIZE = 12;
    const query = req.query as IProductsListPaginationQuery;

    if(!query.limit) {
        query.limit = MAX_PRODUCTS_BATCH_SIZE;
    }

    if(!query.offset) {
        query.offset = 0;
    }

    next();
}

export {
    injectDefaultGetProductsInStoreQueryMiddleware,
    injectDefaultGetProductsQueryMiddleware
};