import { Schema } from "express-validator";

const updateProductCategoryValidationSchema: Schema = {
    idCategory: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idCategory must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idCategory is required"
        },
        toInt: true
    },
    name: {
        in: ["body"],
        optional: { options: { nullable: true } },
        matches: {
            options: [/^[a-zA-Z\s]{1,255}$/],
            errorMessage: "Body value name must contain only letters and spaces",
        },
        isLength:{
            options: { max: 255 },
            errorMessage: "Body value name must have a maximum length of 255 characters"
        },
        trim: true
    },
    isActive: {
        in: ["body"],
        optional: { options: { nullable: true } },
        isBoolean: {
            errorMessage: "Body value isActive must be a boolean",
        },
        toBoolean: true
    }
}

export {
    updateProductCategoryValidationSchema
};