import { Schema } from "express-validator";

const getIncidentsListValidationSchema: Schema = {
    offset: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value offset must be a positive integer",
        },
        toInt: true,
    },
    limit: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value limit must be a positive integer",
        },
        toInt: true,
    }
};

const createIncidentValidationSchema: Schema = {
    idOrder: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idOrder must be a positive integer",
        },
        toInt: true,
    },
    reason: {
        in: ["body"],
        trim: true,
        isLength: {
            options: { max: 255, min: 1 },
            errorMessage:
                "Body value reason can't be ampty and must have a maximum length of 255 characters",
        },
    }
};

export {
    getIncidentsListValidationSchema,
    createIncidentValidationSchema
};