import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IClientAddress, IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { IClientAddressId, IClientByIdParams, IPaymentMethodByIdParams } from "../types/interfaces/request_parameters";
import { createAddressToClient, createClient, createPaymentMethodToClient, deleteAddressFromClient, deletePaymentMethodFromClient, getAddressesFromClient, getPaymentMethodsFromClient, updateClient } from "../services/clients_service";
import { IClientBody, IClientAddressBody, IPaymentMethodBody } from "../types/interfaces/request_bodies";
import { getStores } from "../services/stores_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { findNearestStore, validateNearestStoreDistance } from "../lib/distance_service";

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

async function updateClientController(
    req: Request<IClientByIdParams, {}, IClientBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idClient } = req.params;
        const { birthdate, fullName } = req.body;

        await updateClient(
            idClient!,
        {
            ...(birthdate && { birthdate: birthdate! }),
            ...(fullName && { fullName: fullName! })
        }
        );
        
        res.status(HttpStatusCodes.NO_CONTENT).json();
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

        const stores = await getStores();

        if (stores.length === 0) {
            throw new BusinessLogicException(
                ErrorMessages.NO_STORE_NEARBY
            )
        } else {
            const nearestStore = findNearestStore(
                latitude!,
                longitude!,
                stores
            );

            validateNearestStoreDistance(nearestStore.minDistance);
        }

        const newAddress = await createAddressToClient(
            idClient!,
            { street: street!, streetNumber: streetNumber!, neighborhood: neighborhood!, municipality: municipality!, city: city!, postalCode: postalCode!, state: state!, latitude: latitude!, longitude: longitude!, apartmentNumber: apartmentNumber ?? null }
        );

        res.status(HttpStatusCodes.CREATED).json({ idAddress: newAddress.id });
    } catch (error) {
        next(error);
    }
}

async function deleteAddressFromClientController(
    req: Request<IClientByIdParams & IClientAddressId, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idClient, idAddress } = req.params;

        await deleteAddressFromClient(idClient!, idAddress!);

        res.status(HttpStatusCodes.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
}

export { 
    createPaymentMethodToClientController,
    deletePaymentMethodFromClientController,
    getPaymentMethodsFromClientController,
    getAddressesFromClientController,
    createAddressToClientController,
    createClientController,
    updateClientController,
    deleteAddressFromClientController
};