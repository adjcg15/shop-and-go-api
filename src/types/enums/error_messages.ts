enum CreatePaymentMethodMessages {
    CLIENT_NOT_FOUND = "The client with the specified id is not registered",
    ISSUER_NOT_FOUND = "The issuer with the specified id is not registered",
    PAYMENT_METHOD_ALREADY_EXISTS = "The payment method already exists, verify card number"
}

export { CreatePaymentMethodMessages };