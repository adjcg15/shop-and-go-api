interface IStoreByIdParams {
    idStore?: number;
};

interface IClientByIdParams {
    idClient?: number;
}

interface IProductByIdParams {
    idProduct?: number;
}

interface IPaymentMethodByIdParams {
    idPaymentMethod?: number
}

interface IProductCategoryIdParams {
    idCategory?: number;
}

export {
    IStoreByIdParams,
    IClientByIdParams,
    IProductByIdParams,
    IPaymentMethodByIdParams,
    IProductCategoryIdParams
};