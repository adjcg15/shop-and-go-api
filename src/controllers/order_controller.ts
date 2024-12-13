import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IOrderWithQuantitiesOfProducts } from "../types/interfaces/request_bodies";
import { createOrder } from "../services/order_service";

async function createOrderController(
    req: Request<{}, {}, IOrderWithQuantitiesOfProducts, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idStore, idClient, idDeliveryAddress, idPaymentMethod, idStatus, products } = req.body;

        await createOrder(
            { 
                idStore: idStore!, 
                idClient, 
                idDeliveryAddress, 
                idPaymentMethod, 
                idStatus, 
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