interface IPaymentMethodBody {
    cardHolder?: string;
    expirationMonth?: string;
    expirationYear?: string;
    idEmisor?: number;
    encryptedCardNumber?: string;
    initializationVector?: string;
    authenticationTag?: string;
}

export {
    IPaymentMethodBody
}