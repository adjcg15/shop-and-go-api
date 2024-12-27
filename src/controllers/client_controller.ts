import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IClientAddress, IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { IClientByIdParams, IPaymentMethodByIdParams } from "../types/interfaces/request_parameters";
import { createAddressToClient, createPaymentMethodToClient, deletePaymentMethodFromClient, getAddressesFromClient, getPaymentMethodsFromClient } from "../services/clients_service";
import { IClientAddressBody, IPaymentMethodBody } from "../types/interfaces/request_bodies";

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

async function createAddressToClientController(
    req: Request<IClientByIdParams, {}, IClientAddressBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idClient } = req.params;
        const { street, streetNumber, neighborhood, municipality, city, postalCode, state, latitude, longitude, apartmentNumber } = req.body;

        const newAddress = await createAddressToClient(
            idClient!,
            { street: street!, streetNumber: streetNumber!, neighborhood: neighborhood!, municipality: municipality!, city: city!, postalCode: postalCode!, state: state!, latitude: latitude!, longitude: longitude!, apartmentNumber: apartmentNumber ?? null }
        );

        res.status(HttpStatusCodes.CREATED).json({ idAddress: newAddress.id });
    } catch (error) {
        next(error);
    }
}

export { 
    createPaymentMethodToClientController,
    deletePaymentMethodFromClientController,
    getPaymentMethodsFromClientController,
    getAddressesFromClientController,
    createAddressToClientController
};