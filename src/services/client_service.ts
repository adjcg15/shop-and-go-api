import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Issuer from "../models/Issuer";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { CreatePaymentMethodCodes, DeletePaymentMethodCodes } from "../types/enums/error_codes";
import { CreatePaymentMethodMessages, DeletePaymentMethodMessages } from "../types/enums/error_messages";
import Client from "../models/Client";
import PaymentMethod from "../models/PaymentMethod";

async function addPaymentMethodToClient(
    idClient: number, 
    paymentMethod: { 
        cardholderName: string, 
        expirationMonth: number, 
        expirationYear: number, 
        idIssuer: number, 
        encryptedCardNumber: string, 
        hashedCardNumber: string,
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
            hashedCardNumber,
            initialVector, 
            authenticationTag } = paymentMethod;

        const client = await Client.findByPk(idClient);

        if (client === null) {
            throw new BusinessLogicException(
                CreatePaymentMethodMessages.CLIENT_NOT_FOUND, 
                CreatePaymentMethodCodes.CLIENT_NOT_FOUND);
        }

        const issuer = await Issuer.findByPk(idIssuer);

        if (issuer === null) {
            throw new BusinessLogicException(
                CreatePaymentMethodMessages.ISSUER_NOT_FOUND, 
                CreatePaymentMethodCodes.ISSUER_NOT_FOUND);
        }

        const existingPaymentMethod = await PaymentMethod.findOne({
            where: { hashedCardNumber, idClient }
        });
        
        if (existingPaymentMethod !== null) {
            throw new BusinessLogicException(
                CreatePaymentMethodMessages.PAYMENT_METHOD_ALREADY_EXISTS, 
                CreatePaymentMethodCodes.PAYMENT_METHOD_ALREADY_EXISTS);
        }

        await db.PaymentMethod.create({
            cardholderName, 
            expirationMonth, 
            expirationYear, 
            idIssuer, 
            idClient,
            encryptedCardNumber,
            hashedCardNumber,
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
}

async function deletePaymentMethodFromClient(idClient: number, idPaymentMethod: number) {
    try {
        const client = await Client.findByPk(idClient);

        if (client === null) {
            throw new BusinessLogicException(
                DeletePaymentMethodCodes.CLIENT_NOT_FOUND, 
                DeletePaymentMethodCodes.CLIENT_NOT_FOUND);
        }

        const paymentMethod = await PaymentMethod.findByPk(idPaymentMethod);

        if (paymentMethod === null) {
            throw new BusinessLogicException(
                DeletePaymentMethodCodes.PAYMENT_METHOD_NOT_FOUND, 
                DeletePaymentMethodCodes.PAYMENT_METHOD_NOT_FOUND);
        }

        await PaymentMethod.destroy({
            where: {idClient, id: idPaymentMethod}
        });
        
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    } 
}

export { 
    addPaymentMethodToClient,
    deletePaymentMethodFromClient
}