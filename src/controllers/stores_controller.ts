import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductsInStore, getProductCategories, getIssuingBanks } from "../services/products_service";
import { IProductsListPaginationQuery } from "../types/interfaces/request_queries";
import { IStoreByIdParams } from "../types/interfaces/request_parameters";
import { IProductWithStock} from "../types/interfaces/response_bodies";
import ProductCategory from "../models/ProductCategory";
import Issuer from "../models/Issuer";

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

async function getProductCategoriesController(req: Request, res: Response<InferAttributes<ProductCategory>[]>, next: NextFunction) {
    try {
        const productCategories = await getProductCategories();
        res.status(HttpStatusCodes.OK).json(productCategories);
    } catch (error) {
        next(error);
    }
}

async function getIssuingBanksController(req: Request, res: Response<InferAttributes<Issuer>[]>, next: NextFunction) {
    try {
        const issuingBanks = await getIssuingBanks();
        res.status(HttpStatusCodes.OK).json(issuingBanks);
    } catch (error) {
        next(error);
    }
}

export {
    getProductsInStoreController,
    getProductCategoriesController,
    getIssuingBanksController
};