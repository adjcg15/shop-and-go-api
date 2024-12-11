import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { IClientByIdParams, IPaymentMethodByIdParams } from "../types/interfaces/request_parameters";
import { createPaymentMethodToClient, deletePaymentMethodFromClient, getPaymentMethodsFromClient } from "../services/client_service";
import { InferAttributes } from "sequelize";
import PaymentMethod from "../models/PaymentMethod";

async function createPaymentMethodToClientController(
    req: Request<IClientByIdParams, {}, InferAttributes<PaymentMethod>, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { 
            cardholderName, 
            expirationMonth, 
            expirationYear, 
            idIssuer, 
            encryptedCardNumber,
            hashedCardNumber, 
            initialVector, 
            authenticationTag } = req.body;
        const { idClient } = req.params;

        await createPaymentMethodToClient(
            idClient!,
            { cardholderName: cardholderName!, 
            expirationMonth: expirationMonth!, 
            expirationYear: expirationYear!, 
            idIssuer: idIssuer!, 
            encryptedCardNumber: encryptedCardNumber!, 
            hashedCardNumber: hashedCardNumber!,
            initialVector: initialVector!, 
            authenticationTag: authenticationTag! }
        );

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

async function deletePaymentMethodFromClientController(
    req: Request<IClientByIdParams & IPaymentMethodByIdParams, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idClient, idPaymentMethod } = req.params;

        await deletePaymentMethodFromClient(idClient!, idPaymentMethod!);

        res.status(HttpStatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

async function getPaymentMethodsFromClientController(
    req: Request<IClientByIdParams, {}, {}, {}>,
    res: Response<IPaymentMethodWithIssuer[]>,
    next: NextFunction
) {
    try {
        const { idClient } = req.params;

        const paymentMethods = await getPaymentMethodsFromClient(idClient!);

        res.status(HttpStatusCodes.OK).send(paymentMethods);
    } catch (error) {
        next(error);
    }
}

export { 
    createPaymentMethodToClientController,
    deletePaymentMethodFromClientController,
    getPaymentMethodsFromClientController
};