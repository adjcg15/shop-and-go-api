import { Schema } from "express-validator";

const loginSchema: Schema = {
    phoneNumber: {
        in: ["body"],
        optional: true,
        trim: true,
        isString: {
            errorMessage: "Phone number must be a string"
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: "Phone number must be exactly 10 digits"
        },
        matches: {
            options: /^[0-9]+$/,
            errorMessage: "Phone number must contain only numbers"
        }
    },
    username: {
        in: ["body"],
        optional: true,
        trim: true,
        isString: {
            errorMessage: "User must be a string"
        },
        isAlphanumeric: {
            errorMessage: "User must contain only letters and numbers"
        },
        isLength: {
            options: { min: 1, max: 50 },
            errorMessage: "User must be exactly 10 characters"
        }
    },
    password: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Password is required"
        },
        isString: {
            errorMessage: "Password must be a string"
        },
        isLength: {
            options: { min: 64, max: 64 },
            errorMessage: "Password must be exactly 64 characters"
        },
        matches: {
            options: /^[a-fA-F0-9]+$/,
            errorMessage: "Password must contain only hexadecimal characters"
        }
    },
    atLeastOne: {
        custom: {
            options: (_, { req }) => {
                const hasPhoneNumber = req.body.phoneNumber;
                const hasUser = req.body.username;
                return (hasPhoneNumber && !hasUser) || (!hasPhoneNumber && hasUser);
            },
            errorMessage: "Either phoneNumber or user is required, but not both"
        }
    }    
}

export default loginSchema;