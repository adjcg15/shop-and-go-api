import { Schema } from "express-validator";

const getProductsInStoreValidationSchema: Schema = {
    idStore: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idStore must be a positive integer",
        },
        toInt: true
    },
    offset: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value offset must be a positive integer",
        },
        toInt: true
    },
    limit: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value limit must be a positive integer",
        },
        toInt: true
    },
    query: {
        in: ["query"],
        trim: true,
        optional: { options: { nullable: true } }
    },
    categoryFilter: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value categoryFilter must be a positive integer",
        },
        toInt: true
    }
}

const getAllProductsValidationSchema: Schema = {
    offset: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value offset must be a positive integer",
        },
        toInt: true
    },
    limit: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value limit must be a positive integer",
        },
        toInt: true
    }
}

const getProductInventoriesValidationSchema: Schema = {
    idProduct: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idProduct must be a positive integer",
        },
        toInt: true
    }
}

export {
    getProductsInStoreValidationSchema,
    getAllProductsValidationSchema,
    getProductInventoriesValidationSchema
};