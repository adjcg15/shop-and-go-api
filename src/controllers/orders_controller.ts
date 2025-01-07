import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IOrderWithQuantitiesOfProductsBody } from "../types/interfaces/request_bodies";
import { createOrder, getOrdersByEmployeeAndStatus } from "../services/orders_service";
import { InferAttributes } from "sequelize";
import { IEmployeeByIdParams } from "../types/interfaces/request_parameters";
import { IOrdersForDeliveryQuery } from "../types/interfaces/request_queries";
import Order from "../models/Order";
import { OrderStatus } from "../types/enums/order_status";

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

async function getOrdersToDeliverController(
    req: Request<{}, {}, {}, {}>,
    res: Response<InferAttributes<Order>[]>,
    next: NextFunction
) {
    try {
        const idEmployee = req.user.id;
        const status = OrderStatus.SENT;
        
        const orders = await getOrdersByEmployeeAndStatus(
            idEmployee!,
            status!
        );

        res.status(HttpStatusCodes.OK).json(orders);
    } catch (error) {
        next(error);
    }
}


export {
    createOrderController,
    getOrdersToDeliverController
}