enum ErrorMessages {
    CLIENT_NOT_FOUND = "The client with the specified id is not registered",
    ISSUER_NOT_FOUND = "The issuer with the specified id is not registered",
    PRODUCT_NOT_FOUND = "The product with the specified id is not registered",
    PAYMENT_METHOD_NOT_FOUND = "The payment method with the specified id is not registered",
    PAYMENT_METHOD_ALREADY_EXISTS = "The payment method already exists, verify card number",
    INVALID_CREDENTIALS = "Invalid credentials. Check your phone number or username and password and try it again",
    BAR_CODE_ALREADY_EXISTS = "The bar code already exists, verify it",
    PRODUCT_CATEGORY_NOT_FOUND = "The category with the specified id is not registered"
}

export { 
    ErrorMessages 
};