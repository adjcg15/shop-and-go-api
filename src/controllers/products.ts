import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import db from "../models";

async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await db.Product.findAll();
        console.log(products);
        res.status(HttpStatusCodes.OK).json(products);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    getProducts
};