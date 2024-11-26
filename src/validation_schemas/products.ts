import { Schema } from "express-validator";

const getProductsValidationSchema: Schema = {
    offset: {
        in: ["query"],
        trim: true,
        optional: { options: { nullable: true } },
        isNumeric: {
            errorMessage: "Offset has an invalid format",
        },
        toInt: true
    },
    limit: {
        in: ["query"],
        trim: true,
        optional: { options: { nullable: true } },
        isNumeric: {
            errorMessage: "Limit has an invalid format",
        },
        toInt: true
    },
}

export {
    getProductsValidationSchema
};