import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getProductCategories } from "../services/product_categories_service";
import ProductCategory from "../models/ProductCategory";
import UserRoles from "../types/enums/user_roles";

async function getProductCategoriesController(req: Request, res: Response<InferAttributes<ProductCategory>[]>, next: NextFunction) {
    try {
        const user = req.user;
        const includeInactiveCategories = user?.userRole === UserRoles.ADMINISTRATOR;

        const productCategories = await getProductCategories(includeInactiveCategories);
        res.status(HttpStatusCodes.OK).json(productCategories);
    } catch (error) {
        next(error);
    }
}

export {
    getProductCategoriesController
}