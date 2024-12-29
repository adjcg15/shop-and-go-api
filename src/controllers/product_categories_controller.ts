import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { createProductCategory, getProductCategories, updateProductCategory } from "../services/product_categories_service";
import ProductCategory from "../models/ProductCategory";
import UserRoles from "../types/enums/user_roles";
import { IProductCategoryIdParams } from "../types/interfaces/request_parameters";

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

async function updateProductCategoryController(
    req: Request<IProductCategoryIdParams, {}, Partial<Omit<InferAttributes<ProductCategory>, "id">>>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const category = req.body;
        const { idCategory } = req.params;
        
        const categoryUpdated = await updateProductCategory(idCategory!, category);
        
        if(!categoryUpdated) {
            res.status(HttpStatusCodes.NO_CONTENT).send();
        } else {
            res.status(HttpStatusCodes.OK).json(categoryUpdated);
        }
    } catch (error) {
        next(error);
    }
}

async function createProductCategoryController(
    req: Request<IProductCategoryIdParams, {}, Omit<InferAttributes<ProductCategory>, "id">>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const category = req.body;
        
        const categoryCreated = await createProductCategory(category);
        res.status(HttpStatusCodes.CREATED).json(categoryCreated);
    } catch (error) {
        next(error);
    }
}

export {
    getProductCategoriesController,
    updateProductCategoryController,
    createProductCategoryController
}