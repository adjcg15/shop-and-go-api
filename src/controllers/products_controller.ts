import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { getAllProducts } from "../services/products_service";
import { IProductWithCategory } from "../types/interfaces/response_bodies";

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

export{
    getAllProductsController
}