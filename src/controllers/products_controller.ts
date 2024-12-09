import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { getAllProducts, getProductInventoriesByIdProduct } from "../services/products_service";
import { IProductWithCategory } from "../types/interfaces/response_bodies";
import { IProductByIdParams } from "../types/interfaces/request_parameters";
import { InferAttributes } from "sequelize";
import Inventory from "../models/Inventory";

async function getAllProductsController(
    req: Request<{}, {}, {}, IPaginationQuery>, 
    res: Response<IProductWithCategory[]>, 
    next: NextFunction
) {
    try {
        const { limit, offset } = req.query;

        const products = await getAllProducts({ limit: limit!, offset: offset! });
        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
}

async function getProductInventoriesByIdProductController(
    req: Request<IProductByIdParams, {}, {}, {}>, 
    res: Response<InferAttributes<Inventory>[]>, 
    next: NextFunction
) {
    try {
        const { idProduct } = req.params;

        const inventories = await getProductInventoriesByIdProduct(idProduct!);
        res.status(HttpStatusCodes.OK).json(inventories);
    } catch (error) {
        next(error);
    }
}

export{
    getAllProductsController,
    getProductInventoriesByIdProductController
}