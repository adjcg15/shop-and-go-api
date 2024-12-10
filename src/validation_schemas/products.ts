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

const createProductWithInventoriesValidationsSchema = {
    barCode: {
        in: ["body"],
        isString: {
            errorMessage: "Barcode must be a string."
        },
        matches: {
            options: [/^\d{13}$/],
            errorMessage: "Barcode must have exactly 13 numeric characters."
        },
        notEmpty: {
            errorMessage: "Barcode cannot be empty."
        }
    },
    name: {
        in: ["body"],
        isString: {
            errorMessage: "Name must be a string."
        },
        isLength: {
            options: { max: 255 },
            errorMessage: "Name cannot exceed 255 characters."
        },
        notEmpty: {
            errorMessage: "Name cannot be empty."
        }
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "Description must be a string."
        },
        notEmpty: {
            errorMessage: "Description cannot be empty."
        }
    },
    urlImage: {
        in: ["body"],
        isString: {
            errorMessage: "URL must be a string."
        },
        isURL: {
            options: {
                protocols: ["http", "https"],
                require_protocol: true
            },
            errorMessage: "URL must be a valid HTTP or HTTPS URL."
        },
        notEmpty: {
            errorMessage: "URL cannot be empty."
        }
    },
    salePrice: {
        in: ["body"],
        isFloat: {
            options: { min: 0 },
            errorMessage: "SalePrice must be a valid number greater than or equal to 0."
        },
        notEmpty: {
            errorMessage: "SalePrice cannot be empty."
        }
    },
    maximunAmount: {
        in: ["body"],
        isInt: {
            options: { min: 0 },
            errorMessage: "MaximunAmount must be an integer greater than or equal to 0."
        },
        notEmpty: {
            errorMessage: "MaximunAmount cannot be empty."
        }
    },
    idCategory: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "IdCategory must be an integer greater than or equal to 1."
        },
        notEmpty: {
            errorMessage: "IdCategory cannot be empty."
        }
    },
    inventories: {
        in: ["body"],
        optional: true,
        isArray: {
            errorMessage: "Inventories must be an array."
        },
        custom: {
            options: (value: any) => {
                if (!Array.isArray(value)) return false;
                return value.every(item => {
                    if (
                        typeof item.idStore !== 'number' || item.idStore <= 0 ||
                        typeof item.stock !== 'number' || item.stock < 1 ||
                        typeof item.expirationDate !== 'string' || !/\d{4}-\d{2}-\d{2}/.test(item.expirationDate)
                    ) {
                        return false;
                    }
                    const [year, month, day] = item.expirationDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return (
                        date.getFullYear() === year &&
                        date.getMonth() === month - 1 &&
                        date.getDate() === day
                    );
                });
            },
            errorMessage: "Each inventory must have a valid idStore (integer > 0), stock (integer >= 1), and a valid expirationDate (SQL Server date format)."
        }
    }
};

export {
    getProductsInStoreValidationSchema,
    getAllProductsValidationSchema,
    getProductInventoriesValidationSchema,
    createProductWithInventoriesValidationsSchema
};