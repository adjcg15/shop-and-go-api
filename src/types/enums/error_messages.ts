enum ErrorMessages {
    CLIENT_NOT_FOUND = "The client with the specified id is not registered",
    EMPLOYEE_NOT_FOUND = "The employee with the specified id is not registered",
    ISSUER_NOT_FOUND = "The issuer with the specified id is not registered",
    PRODUCT_NOT_FOUND = "The product with the specified id is not registered",
    STORE_NOT_FOUND = "The store with the specified id is not registered",
    STORE_NAME_DUPLICATED = "The store with the given name already exists",
    STORE_LOCATION_DUPLICATED = "The store with the given location (latitude and longitude) already exists",
    DELIVERY_ADDRESS_NOT_FOUND = "The delivery address with the specified id is not registered",
    ORDER_STATUS_NOT_FOUND = "The order status with the specified id is not registered",
    ORDER_NOT_FOUND = "The order with the given id does not exists",
    STOCK_NOT_AVAILABLE = "The order could not be placed because at least one product is not satisfied with its current stock",
    INVENTORY_NOT_FOUND = "The inventory with the specified id is not registered",
    INVENTORY_DOES_NOT_EXIST = "At least one of the ordered products is not registered in the store's inventory",
    PAYMENT_METHOD_NOT_FOUND = "The payment method with the specified id is not registered",
    PAYMENT_METHOD_ALREADY_EXISTS = "The payment method already exists, verify card number",
    INVALID_CREDENTIALS = "Invalid credentials. Check your phone number or username and password and try it again",
    BAR_CODE_ALREADY_EXISTS = "The bar code already exists, verify it",
    PRODUCT_CATEGORY_NOT_FOUND = "The category with the specified id is not registered",
    DUPLICATED_PRODUCT_CATEGORY = "A category already exists with that category name",
    MAXIMUM_AMOUNT_IS_EXCEEDED = "In at least one product, the maximum allowed purchase amount has been exceeded",
    NO_STORE_NEARBY = "No stores within 5km radius",
    ADDRESS_ALREADY_EXISTS = "The address already exists, verify it",
    ADDRESS_NOT_FOUND = "The adddress with the specified id is not registered",
    CLIENT_ALREADY_EXISTS = "The client with the specified phone number already exists",
    EMPLOYEE_POSITION_NOT_FOUND = "The employee position with the specified id is not registered",
    EMPLOYEE_ALREADY_EXISTS = "The employee already exists, verify it",
    STORE_OF_EMPLOYEE_NOT_FOUNT = "The is not any store related to the employee requesting the information"
}

export { 
    ErrorMessages 
};