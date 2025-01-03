import { Schema } from "express-validator";

const updateProductCategoryValidationSchema: Schema = {
    idCategory: {
        in: ["params"],
        notEmpty: {
            errorMessage: "idCategory is required"
        },
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idCategory must be a positive integer",
        },
        toInt: true
    },
    name: {
        in: ["body"],
        optional: { options: { nullable: true } },
        trim: true,
        matches: {
            options: [/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]{1,255}$/],
            errorMessage: "Body value name must contain only letters and spaces",
        },
        isLength:{
            options: { max: 255 },
            errorMessage: "Body value name must have a maximum length of 255 characters"
        },
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

const createProductCategoryValidationSchema: Schema = {
    name: {
        in: ["body"],
        trim: true,
        matches: {
            options: [/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]{1,255}$/],
            errorMessage: "Body value name must contain only letters and spaces",
        },
        isLength:{
            options: { max: 255 },
            errorMessage: "Body value name must have a maximum length of 255 characters"
        },
    },
    isActive: {
        in: ["body"],
        isBoolean: {
            errorMessage: "Body value isActive must be a boolean",
        },
        toBoolean: true
    }
}

export {
    updateProductCategoryValidationSchema,
    createProductCategoryValidationSchema
};