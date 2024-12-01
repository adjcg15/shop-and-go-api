import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductsInStore } from "../services/products_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import { IStoreByIdParams } from "../types/interfaces/request_parameters";

async function getProductsInStoreController(req: Request, res: Response, next: NextFunction) {
    try {
        const { limit, offset, query, categoryFilter } = req.query as IProductsListPaginationQuery;
        const { idStore } = req.params as IStoreByIdParams;

        const products = await getProductsInStore(
            idStore!,
            { limit: limit!, offset: offset!, query: query!, categoryFilter }
        );
        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    getProductsInStoreController
};