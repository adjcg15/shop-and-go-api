interface IPaymentMethodBody {
    cardholderName?: string;
    expirationMonth?: number;
    expirationYear?: number;
    idIssuer?: number;
    encryptedCardNumber?: string;
    hashedCardNumber?: string;
    initialVector?: string;
    authenticationTag?: string;
}

interface ILoginBody {
    phoneNumber?: string;
    username?: string;
    password?: string;
}

export {
    IPaymentMethodBody,
    ILoginBody
}