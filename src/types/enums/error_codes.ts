import { EndpointContexts } from "./endpoint_contexts";

enum CreatePaymentMethodCodes {
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD + "-400003"
}

export { CreatePaymentMethodCodes };