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
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400002",
    INVENTORY_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400003"
}

enum CreateOrderErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400001",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400002",
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400003",
    DELIVERY_ADDRESS_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400004",
    ORDER_STATUS_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400005",
    PRODUCT_NOT_FOUND = EndpointContexts.CREATE_ORDER + "-400006",
    STOCK_NOT_AVAILABLE = EndpointContexts.CREATE_ORDER + "-400007",
    INVENTORY_DOES_NOT_EXIST = EndpointContexts.CREATE_ORDER + "-400008",
    MAXIMUM_AMOUNT_IS_EXCEEDED = EndpointContexts.CREATE_ORDER + "-400009"
}

enum GetStoreInventoriesErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.GET_STORE_INVENTORIES + "-400001",
    PRODUCT_NOT_FOUND = EndpointContexts.GET_STORE_INVENTORIES + "-400002",
    INVENTORY_DOES_NOT_EXIST = EndpointContexts.GET_STORE_INVENTORIES + "-400003"
}

export { 
    CreatePaymentMethodErrorCodes,
    DeletePaymentMethodErrorCodes,
    CreateProductErrorCodes,
    UpdateProductErrorCodes,
    CreateOrderErrorCodes,
    GetStoreInventoriesErrorCodes
};