interface IStoreByIdParams {
    idStore?: number;
}

interface IClientByIdParams {
    idClient?: number;
}

interface IProductByIdParams {
    idProduct?: number;
}

interface IProductByBarCodeParams {
    barCode?: string;
}

interface IPaymentMethodByIdParams {
    idPaymentMethod?: number;
}

interface IClientAddressId {
    idAddress?: number;
}

export {
    IStoreByIdParams,
    IClientByIdParams,
    IProductByIdParams,
    IProductByBarCodeParams,
    IPaymentMethodByIdParams,
    IClientAddressId,
};
