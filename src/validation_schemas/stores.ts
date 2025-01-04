import { Schema } from "express-validator";

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

export { getStoreValidationSchema };
