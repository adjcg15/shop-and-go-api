import { Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";

async function addPaymentMethodToClient(
    idClient: number, 
    paymentMethod: { 
        cardholderName: string, 
        expirationMonth: number, 
        expirationYear: number, 
        idIssuer: number, 
        encryptedCardNumber: string, 
        initialVector: string, 
        authenticationTag: string }
    ) {

    try {
        const { 
            cardholderName, 
            expirationMonth, 
            expirationYear, 
            idIssuer, 
            encryptedCardNumber, 
            initialVector, 
            authenticationTag } = paymentMethod;
        
        await db.PaymentMethod.create({
            cardholderName, 
            expirationMonth, 
            expirationYear, 
            idIssuer, 
            idClient,
            encryptedCardNumber, 
            initialVector, 
            authenticationTag, 
            isActive: true
        });

    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    } 

    //TODO Ver valor de retorno
}

export { addPaymentMethodToClient }