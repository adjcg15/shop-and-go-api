import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IPaymentMethodBody } from "../types/interfaces/request_bodies";
import { IClientByIdParams } from "../types/interfaces/request_parameters";

async function addPaymentMethodToClientController(
    req: Request<IClientByIdParams, {}, IPaymentMethodBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { 
            cardHolder, 
            expirationMonth, 
            expirationYear, 
            idEmisor, 
            encryptedCardNumber, 
            initializationVector, 
            authenticationTag } = req.body;
        const { idClient } = req.params;

        //TODO recuperar lista de tarjetas para comparar el cifrado y ver que no esté registrado ya el método de pago

        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

export { addPaymentMethodToClientController };