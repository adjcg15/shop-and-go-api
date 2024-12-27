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

const getAddressesFromClientValidationSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idClient is required"
        },
        toInt: true
    }
}

const createAddressToClientValidationSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idClient is required"
        },
        toInt: true
    },
    street: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255 },
            errorMessage: "Street cannot exceed 255 characters"
        },
        isString: {
            errorMessage: "Street must be a string"
        },
        notEmpty: {
            errorMessage: "Street is required"
        }
    },
    streetNumber: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 5 },
            errorMessage: "Street number cannot exceed 5 characters"
        },
        isString: {
            errorMessage: "Street number must be a string"
        },
        notEmpty: {
            errorMessage: "Street number is required"
        },
        matches: {
            options: /^\d+$/,
            errorMessage: "Street number must contain only numeric characters"
        }
    },
    apartmentNumber: {
        in: ["body"],
        optional: true,
        trim: true,
        isLength: {
            options: { max: 5 },
            errorMessage: "Apartment number cannot exceed 5 characters"
        },
        isString: {
            errorMessage: "Apartment number must be a string"
        },
        matches: {
            options: /^[a-zA-Z0-9-]*$/,
            errorMessage: "Apartment number must contain only alphanumeric characters or hyphens"
        }
    },
    neighborhood: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255 },
            errorMessage: "Neighborhood cannot exceed 255 characters"
        },
        isString: {
            errorMessage: "Neighborhood must be a string"
        },
        notEmpty: {
            errorMessage: "Neighborhood is required"
        }
    },
    municipality: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255 },
            errorMessage: "Municipality cannot exceed 255 characters"
        },
        isString: {
            errorMessage: "Municipality must be a string"
        },
        notEmpty: {
            errorMessage: "Municipality is required"
        }
    },
    city: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255 },
            errorMessage: "City cannot exceed 255 characters"
        },
        isString: {
            errorMessage: "City must be a string"
        },
        notEmpty: {
            errorMessage: "City is required"
        }
    },
    postalCode: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { min: 5, max: 5 },
            errorMessage: "Postal code must be exactly 5 digits"
        },
        isString: {
            errorMessage: "Postal code must be a string"
        },
        notEmpty: {
            errorMessage: "Postal code is required"
        },
        matches: {
            options: /^\d{5}$/,
            errorMessage: "Postal code must contain exactly 5 numeric characters"
        }
    },
    state: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255 },
            errorMessage: "State cannot exceed 255 characters"
        },
        isString: {
            errorMessage: "State must be a string"
        },
        notEmpty: {
            errorMessage: "State is required"
        }
    },
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
    getNearestStoreValidationSchema,
    getAddressesFromClientValidationSchema,
    createAddressToClientValidationSchema
}