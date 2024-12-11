import { EndpointContexts } from "./endpoint_contexts";

enum PaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400003",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD + "-400004"
}

enum ProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.GET_ALL_PRODUCTS + "-400001",
    BAR_CODE_ALREADY_EXISTS = EndpointContexts.CREATE_PRODUCT + "-400002",
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.CREATE_PRODUCT + "-400003"
}

export { 
    PaymentMethodErrorCodes,
    ProductErrorCodes
};