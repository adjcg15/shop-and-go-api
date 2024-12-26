import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Issuer from "../models/Issuer";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { CreatePaymentMethodErrorCodes, DeletePaymentMethodErrorCodes } from "../types/enums/error_codes";
import { ErrorMessages } from "../types/enums/error_messages";
import Client from "../models/Client";
import PaymentMethod from "../models/PaymentMethod";
import { IClientWithOptionalPassword, IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { compareHashedString, decryptCardNumber, encryptCardNumber, hashString } from "../lib/security_service";

async function createPaymentMethodToClient(
    idClient: number, 
    paymentMethod: { 
        cardholderName: string, 
        expirationMonth: number, 
        expirationYear: number, 
        idIssuer: number,
        cardNumber: string, }
    ) {

    try {
        const { 
            cardholderName, 
            expirationMonth, 
            expirationYear, 
            idIssuer, 
            cardNumber } = paymentMethod;

        const client = await Client.findByPk(idClient);

        if (client === null) {
            throw new BusinessLogicException(
                ErrorMessages.CLIENT_NOT_FOUND, 
                CreatePaymentMethodErrorCodes.CLIENT_NOT_FOUND);
        }

        const issuer = await Issuer.findByPk(idIssuer);

        if (issuer === null) {
            throw new BusinessLogicException(
                ErrorMessages.ISSUER_NOT_FOUND, 
                CreatePaymentMethodErrorCodes.ISSUER_NOT_FOUND);
        }

        const existingPaymentMethods = await PaymentMethod.findAll({
            where: { idClient }
        });

        for(const paymentMethod of existingPaymentMethods) {
            const paymentMethodsAreSame = await compareHashedString(cardNumber, paymentMethod.hashedCardNumber);

            if(paymentMethodsAreSame) {
                throw new BusinessLogicException(
                    ErrorMessages.PAYMENT_METHOD_ALREADY_EXISTS, 
                    CreatePaymentMethodErrorCodes.PAYMENT_METHOD_ALREADY_EXISTS);
            }
        }

        const { encryptedCardNumber, initialVector, authenticationTag } = encryptCardNumber(cardNumber!);
        const hashedCardNumber = hashString(cardNumber);

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
                ErrorMessages.CLIENT_NOT_FOUND, 
                DeletePaymentMethodErrorCodes.CLIENT_NOT_FOUND);
        }

        const paymentMethod = await PaymentMethod.findByPk(idPaymentMethod);

        if (paymentMethod === null) {
            throw new BusinessLogicException(
                ErrorMessages.PAYMENT_METHOD_NOT_FOUND, 
                DeletePaymentMethodErrorCodes.PAYMENT_METHOD_NOT_FOUND);
        }

        await PaymentMethod.update(
            {
                isActive: false
            },
            {
                where: {idClient, id: idPaymentMethod}
            }
        );
        
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    } 
}

async function getPaymentMethodsFromClient(idClient: number) {
    const paymentMethodsList: IPaymentMethodWithIssuer[] = [];
    try {
        const client = await Client.findByPk(idClient);
        if (client === null) {
            throw new BusinessLogicException(ErrorMessages.CLIENT_NOT_FOUND);
        }

        const paymentMethods = await PaymentMethod.findAll({
            where: { idClient, isActive: true },
            include: [{
                association: db.PaymentMethod.associations.issuer
            }]
        });
        
        paymentMethods.forEach(paymentMethod => {
            const cardNumber = decryptCardNumber(
                paymentMethod.encryptedCardNumber, 
                Buffer.from(paymentMethod.initialVector, 'hex'), 
                Buffer.from(paymentMethod.authenticationTag, 'hex')
            );
            const paymentMethodInfo = {
                id: paymentMethod.id,
                cardholderName: paymentMethod.cardholderName,
                endCardNumber: cardNumber.slice(-4),
                bankIssuer: paymentMethod.issuer?.name!
            };
            paymentMethodsList.push(paymentMethodInfo);
        });           
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    } 

    return paymentMethodsList;
}

async function getClientById(id: number) {
    let client: IClientWithOptionalPassword;

    try {
        const dbClient = await db.Client.findByPk(id);

        if (dbClient === null) {
            throw new BusinessLogicException(ErrorMessages.CLIENT_NOT_FOUND);
        }

        client = dbClient.toJSON();
        delete client.passwordHash;
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return client;
}

export { 
    createPaymentMethodToClient,
    deletePaymentMethodFromClient,
    getPaymentMethodsFromClient,
    getClientById
}