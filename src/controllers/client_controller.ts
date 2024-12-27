import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IClientAddress, IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { IClientByIdParams, IPaymentMethodByIdParams } from "../types/interfaces/request_parameters";
import { createClient, createPaymentMethodToClient, deletePaymentMethodFromClient, getAddressesFromClient, getPaymentMethodsFromClient } from "../services/clients_service";
import { IClientBody, IPaymentMethodBody } from "../types/interfaces/request_bodies";

async function createPaymentMethodToClientController(
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
            cardNumber } = req.body;
        const { idClient } = req.params;

        await createPaymentMethodToClient(
            idClient!,
            { cardholderName: cardholderName!, 
            expirationMonth: expirationMonth!, 
            expirationYear: expirationYear!, 
            idIssuer: idIssuer!, 
            cardNumber: cardNumber! }
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

async function getAddressesFromClientController(
    req: Request<IClientByIdParams, {}, {}, {}>,
    res: Response<IClientAddress[]>,
    next: NextFunction
) {
    try {
        const { idClient } = req.params;
        const addresses = await getAddressesFromClient(idClient!);
        res.status(HttpStatusCodes.OK).send(addresses);
    } catch (error) {
        next(error);
    }
}

async function createClientController(
    req: Request<{}, {}, IClientBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { password, birthdate, fullName, phoneNumber } = req.body;

        await createClient(
            {
                password: password!,
                birthdate: birthdate!,
                fullName: fullName!,
                phoneNumber: phoneNumber!
            }
        );

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

export { 
    createPaymentMethodToClientController,
    deletePaymentMethodFromClientController,
    getPaymentMethodsFromClientController,
    getAddressesFromClientController,
    createClientController
};