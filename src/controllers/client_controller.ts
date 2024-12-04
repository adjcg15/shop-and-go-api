import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaymentMethodBody } from "../types/interfaces/request_bodies";
import { IClientByIdParams } from "../types/interfaces/request_parameters";
import { addPaymentMethodToClient } from "../services/client_service";

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
            initialVector: initialVector!, 
            authenticationTag: authenticationTag! }
        );

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

export { addPaymentMethodToClientController };