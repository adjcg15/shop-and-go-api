import { Schema } from "express-validator";

const getNearestStoreValidationSchema: Schema = {
    latitude: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Latitude is required"
        },
        isFloat: {
            errorMessage: "Latitude must be a float"
        },
        custom: {
            options: (value) => value >= -90 && value <= 90,
            errorMessage: "Latitude must be a valid latitude"
        },
        toFloat: true
    },
    longitude: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Longitude is required"
        },
        isFloat: {
            errorMessage: "Longitude must be a float"
        },
        custom: {
            options: (value) => value >= -180 && value <= 180,
            errorMessage: "Longitude must be a valid longitude"
        },
        toFloat: true
    }
}

export {
    getNearestStoreValidationSchema
}