import { EndpointContexts } from "./endpoint_contexts";

enum CreatePaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD + "-400004"
}

enum DeletePaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400001",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400002",
}

enum CreateProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.CREATE_PRODUCT + "-400001",
    BAR_CODE_ALREADY_EXISTS = EndpointContexts.CREATE_PRODUCT + "-400002",
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.CREATE_PRODUCT + "-400003"
}

enum UpdateProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400001",
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400002"
}

export { 
    CreatePaymentMethodErrorCodes,
    DeletePaymentMethodErrorCodes,
    CreateProductErrorCodes,
    UpdateProductErrorCodes
};