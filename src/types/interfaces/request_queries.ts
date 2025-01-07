interface IPaginationQuery {
    limit?: number;
    offset?: number;
    query?: string;
};

interface IProductsListPaginationQuery extends IPaginationQuery {
    categoryFilter?: number;
};

interface IOrdersForDeliveryQuery {
    status?: string;
}

export {
    IPaginationQuery,
    IProductsListPaginationQuery,
    IOrdersForDeliveryQuery
};