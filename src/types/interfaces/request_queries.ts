interface IPaginationQuery {
    limit?: number;
    offset?: number;
    query?: string;
};

interface IProductsListPaginationQuery extends IPaginationQuery {
    categoryFilter?: number;
};

export {
    IProductsListPaginationQuery
};