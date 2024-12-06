import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaymentMethodBody } from "../types/interfaces/request_bodies";
import { IClientByIdParams, IPaymentMethodByIdParams } from "../types/interfaces/request_parameters";
import { addPaymentMethodToClient, deletePaymentMethodFromClient, getPaymentMethodsFromClient } from "../services/client_service";
import { InferAttributes } from "sequelize";
import PaymentMethod from "../models/PaymentMethod";

async function addPaymentMethodToClientController(
    req: Request<IClientByIdParams, {}, IPaymentMethodBody, {}>,
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

        await addPaymentMethodToClient(
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
    res: Response<InferAttributes<PaymentMethod>[]>,
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
    addPaymentMethodToClientController,
    deletePaymentMethodFromClientController
};