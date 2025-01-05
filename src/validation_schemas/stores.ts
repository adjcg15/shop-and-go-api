import { Schema } from "express-validator";

const updateStoreValidationSchema: Schema = {
    idStore: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idStore must be a positive integer",
        },
        toInt: true,
    },
    name: {
        in: ["body"],
        trim: true,
        matches: {
            options: [/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]{1,255}$/],
            errorMessage:
                "Body value name must contain only letters and spaces",
        },
        isLength: {
            options: { max: 255 },
            errorMessage:
                "Body value name must have a maximum length of 255 characters",
        },
    },
    address: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255, min: 1 },
            errorMessage:
                "Body value address can't be ampty and must have a maximum length of 255 characters",
        },
    },
    openingTime: {
        in: ["body"],
        trim: true,
        matches: {
            options: [/^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/],
            errorMessage:
                "Body value openingTime must be an hour in format 00:00:00",
        },
    },
    closingTime: {
        in: ["body"],
        trim: true,
        matches: {
            options: [/^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/],
            errorMessage:
                "Body value openingTime must be an hour in format 00:00:00",
        },
    },
    latitude: {
        in: ["body"],
        trim: true,
        isFloat: {
            options: { min: -90, max: 90 },
            errorMessage:
                "Body value latitude must be a numeric  value between -90 and 90",
        },
        toFloat: true,
    },
    longitude: {
        in: ["body"],
        trim: true,
        isFloat: {
            options: { min: -180, max: 180 },
            errorMessage:
                "Body value longitude must be a numeric  value between -180 and 180",
        },
        toFloat: true,
    },
};

const getStoreValidationSchema: Schema = {
    idStore: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idStore must be a positive integer",
        },
        toInt: true,
    },
};

export { getStoreValidationSchema, updateStoreValidationSchema };
