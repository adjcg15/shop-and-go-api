import { EndpointContexts } from "./endpoint_contexts";

enum PaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400003",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD + "-400004"
}

export { 
    PaymentMethodErrorCodes
};