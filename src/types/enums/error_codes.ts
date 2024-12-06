import { EndpointContexts } from "./endpoint_contexts";

enum CreatePaymentMethodCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD + "-400003"
}

enum DeletePaymentMethodCodes {
    CLIENT_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400001",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400002"
}

export { 
    CreatePaymentMethodCodes,
    DeletePaymentMethodCodes
};