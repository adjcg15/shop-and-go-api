import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Issuer from "../models/Issuer";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { CreateClientErrorCodes,CreateAddressMethodErrorCodes, CreatePaymentMethodErrorCodes, DeletePaymentMethodErrorCodes, DeleteAddressErrorCodes } from "../types/enums/error_codes";
import { ErrorMessages } from "../types/enums/error_messages";
import Client from "../models/Client";
import PaymentMethod from "../models/PaymentMethod";
import { IClientAddress, IClientWithOptionalPassword, IPaymentMethodWithIssuer } from "../types/interfaces/response_bodies";
import { compareHashedString, decryptCardNumber, encryptCardNumber, hashString } from "../lib/security_service";
import Address from "../models/Address";

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

async function getAddressesFromClient(idClient: number) {
    const addressesList: IClientAddress[] = [];
    try {
        const client = await Client.findByPk(idClient);
        if (client === null) {
            throw new BusinessLogicException(ErrorMessages.CLIENT_NOT_FOUND);
        }

        const addresses = await Address.findAll({
            where: { idClient, isActive: true }
        })
        
        addresses.forEach(address => {
            const addressInfo: IClientAddress = {
                id: address.id,
                street: address.street,
                streetNumber: address.streetNumber,
                apartmentNumber: address.apartmentNumber ?? undefined,
                neighborhood: address.neighborhood,
                municipality: address.municipality,
                city: address.city,
                postalCode: address.postalCode,
                state: address.state,
                latitude: address.latitude,
                longitude: address.longitude
            };
            addressesList.push(addressInfo);
        });          
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    } 

    return addressesList;
}

async function createClient(
    client: {
        password: string,
        birthdate: string,
        fullName: string,
        phoneNumber: string
    }
) {
    try {
        const {
            password,
            birthdate,
            fullName,
            phoneNumber
        } = client;
    
        const existingPhoneNumber = await Client.findOne({
            where: { phoneNumber }
        });
        
        if (existingPhoneNumber !== null) {
            throw new BusinessLogicException(
                ErrorMessages.CLIENT_ALREADY_EXISTS, 
                CreateClientErrorCodes.CLIENT_ALREADY_EXISTS);
        }

        const passwordHash = hashString(password);

        await db.Client.create({
            passwordHash: passwordHash,
            birthdate: birthdate,
            fullName: fullName,
            phoneNumber: phoneNumber
        });
        
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function createAddressToClient(
    idClient: number, 
    address: {
        street: string,
        streetNumber: string,
        neighborhood: string,
        municipality: string,
        city: string,
        postalCode: string,
        state: string,
        latitude: number,
        longitude: number,
        apartmentNumber?: string | null
    }
) {
    let newAddress: Address;

    try {
        const client = await Client.findByPk(idClient);

        if (client === null) {
            throw new BusinessLogicException(ErrorMessages.CLIENT_NOT_FOUND,
                CreateAddressMethodErrorCodes.CLIENT_NOT_FOUND
            );
        }

        const existingAddress = await Address.findOne({
            where: { idClient, isActive: true, ...address }
        })

        if (existingAddress !== null) {
            throw new BusinessLogicException(ErrorMessages.ADDRESS_ALREADY_EXISTS,
                CreateAddressMethodErrorCodes.ADDRESS_ALREADY_EXISTS
            );
        }

        newAddress = await db.Address.create({
            ...address,
            idClient,
            isActive: true
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return newAddress;
}

async function deleteAddressFromClient(idClient: number, idAddress: number) {
    try {
        const client = await Client.findByPk(idClient);

        if(client === null) {
            throw new BusinessLogicException(
                ErrorMessages.CLIENT_NOT_FOUND,
                DeleteAddressErrorCodes.CLIENT_NOT_FOUND
            );
        }

        const address = await Address.findByPk(idAddress);

        if (address === null) {
            throw new BusinessLogicException(
                ErrorMessages.ADDRESS_NOT_FOUND,
                DeleteAddressErrorCodes.DELIVERY_ADDRESS_NOT_FOUND
            );
        }

        await Address.update(
            {
                isActive: false
            },
            {
                where: {idClient, id: idAddress}
            }
        )
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

export { 
    createPaymentMethodToClient,
    deletePaymentMethodFromClient,
    getPaymentMethodsFromClient,
    getClientById,
    getAddressesFromClient,
    createClient,
    createAddressToClient,
    deleteAddressFromClient
}