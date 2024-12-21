import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IOrderWithQuantitiesOfProductsBody } from "../types/interfaces/request_bodies";
import { createOrder } from "../services/orders_service";

async function createOrderController(
    req: Request<{}, {}, IOrderWithQuantitiesOfProductsBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idStore, idClient, idDeliveryAddress, idPaymentMethod, products } = req.body;

        await createOrder(
            { 
                idStore: idStore!, 
                idClient, 
                idDeliveryAddress, 
                idPaymentMethod, 
                products: products! 
            }
        );

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

export {
    createOrderController
}