import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductCategories } from "../services/product_categories_service";
import ProductCategory from "../models/ProductCategory";

async function getProductCategoriesController(req: Request, res: Response<InferAttributes<ProductCategory>[]>, next: NextFunction) {
    try {
        const productCategories = await getProductCategories();
        res.status(HttpStatusCodes.OK).json(productCategories);
    } catch (error) {
        next(error);
    }
}

export {
    getProductCategoriesController
}