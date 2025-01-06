import { EndpointContexts } from "./endpoint_contexts";

enum CreatePaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400001",
    ISSUER_NOT_FOUND = EndpointContexts.CREATE_PAYMENT_METHOD + "-400002",
    PAYMENT_METHOD_ALREADY_EXISTS = EndpointContexts.CREATE_PAYMENT_METHOD +
        "-400004",
}

enum DeletePaymentMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD + "-400001",
    PAYMENT_METHOD_NOT_FOUND = EndpointContexts.DELETE_PAYMENT_METHOD +
        "-400002",
}

enum CreateProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.CREATE_PRODUCT + "-400001",
    BAR_CODE_ALREADY_EXISTS = EndpointContexts.CREATE_PRODUCT + "-400002",
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.CREATE_PRODUCT + "-400003",
}

enum UpdateProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400001",
    PRODUCT_CATEGORY_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400002",
    INVENTORY_NOT_FOUND = EndpointContexts.UPDATE_PRODUCT + "-400003",
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
    MAXIMUM_AMOUNT_IS_EXCEEDED = EndpointContexts.CREATE_ORDER + "-400009",
}

enum GetProductInventoryInStoreErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.GET_PRODUCT_INVENTORY_IN_STORE +
        "-400001",
    PRODUCT_NOT_FOUND = EndpointContexts.GET_PRODUCT_INVENTORY_IN_STORE +
        "-400002",
    INVENTORY_DOES_NOT_EXIST = EndpointContexts.GET_PRODUCT_INVENTORY_IN_STORE +
        "-400003",
}

enum GetStoreInventoriesErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.GET_STORE_INVENTORIES + "-400001",
    PRODUCT_NOT_FOUND = EndpointContexts.GET_STORE_INVENTORIES + "-400002",
    INVENTORY_DOES_NOT_EXIST = EndpointContexts.GET_STORE_INVENTORIES +
        "-400003",
}

enum GetStoreErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.GET_STORE + "-400001",
}

enum GetProductErrorCodes {
    PRODUCT_NOT_FOUND = EndpointContexts.GET_PRODUCT + "-400001",
}

enum GetProductWithStockInStoreErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.GET_PRODUCT_WITH_STOCK_IN_STORE +
        "-400001",
    PRODUCT_NOT_FOUND = EndpointContexts.GET_PRODUCT_WITH_STOCK_IN_STORE +
        "-400002",
    INVENTORY_DOES_NOT_EXIST = EndpointContexts.GET_PRODUCT_WITH_STOCK_IN_STORE +
        "-400003",
}

enum CreateClientErrorCodes {
    CLIENT_ALREADY_EXISTS = EndpointContexts.CREATE_CLIENT + "-400001",
}

enum CreateAddressMethodErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.CREATE_ADDRESS + "-400001",
    ADDRESS_ALREADY_EXISTS = EndpointContexts.CREATE_ADDRESS + "-400002",
}

enum DeleteAddressErrorCodes {
    CLIENT_NOT_FOUND = EndpointContexts.DELETE_ADDRESS + "-400001",
    DELIVERY_ADDRESS_NOT_FOUND = EndpointContexts.DELETE_ADDRESS + "-400002",
}

enum CreateEmployeeErrorCodes {
    STORE_NOT_FOUND = EndpointContexts.CREATE_EMPLOYEE + "-400001",
    EMPLOYEE_POSITION_NOT_FOUND = EndpointContexts.CREATE_EMPLOYEE + "-400002",
    EMPLOYEE_ALREADY_EXISTS = EndpointContexts.CREATE_EMPLOYEE + "-400003",
}

enum CreateStoreErrorCodes {
    STORE_NAME_DUPLICATED = EndpointContexts.CREATE_STORE + "-400001",
    STORE_LOCATION_DUPLICATED = EndpointContexts.CREATE_STORE + "-400002"
}

enum UpdateStoreErrorCodes {
    STORE_NAME_DUPLICATED = EndpointContexts.UPDATE_STORE + "-400001",
    STORE_LOCATION_DUPLICATED = EndpointContexts.UPDATE_STORE + "-400002"
}

export {
    CreatePaymentMethodErrorCodes,
    DeletePaymentMethodErrorCodes,
    CreateProductErrorCodes,
    UpdateProductErrorCodes,
    CreateOrderErrorCodes,
    GetStoreInventoriesErrorCodes,
    GetStoreErrorCodes,
    GetProductInventoryInStoreErrorCodes,
    GetProductErrorCodes,
    GetProductWithStockInStoreErrorCodes,
    CreateClientErrorCodes,
    CreateAddressMethodErrorCodes,
    DeleteAddressErrorCodes,
    CreateEmployeeErrorCodes,
    CreateStoreErrorCodes,
    UpdateStoreErrorCodes
};
