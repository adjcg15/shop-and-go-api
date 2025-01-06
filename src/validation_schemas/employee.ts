import { Schema } from "express-validator"

const createEmployeeSchema: Schema = {
    fullName: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Full name cannot be empty"
        },
        isString: {
            errorMessage: "Full name must be a string"
        },
        matches: {
            options: [/^[\p{L}\s\-']+$/u],
            errorMessage: "Full name can only contain letters, spaces, hyphens, and apostrophes"
        },
        custom: {
            options: (value: any) => {
                const nameParts = value.split(" ");
                return nameParts.length >= 2;
            },
            errorMessage: "Full name must contain at least a first name and a last name"
        }
    },
    user: {
        in:["body"],
        notEmpty: {
            errorMessage: "User cannot be empty"
        },
        isString: {
            errorMessage: "User must be a string"
        },
        isAlphanumeric: {
            errorMessage: "User must contain only letters and numbers"
        },
        isLength: {
            options: { min: 1, max: 50 },
            errorMessage: "User must be between 1 and 50 characters"
        }
    },
    password: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isString: {
            errorMessage: "Password must be a string"
        },
        isLength: {
            options: { min: 8, max: 16 },
            errorMessage: "Password must contain between 8 and 16 characters"
        },
        custom: {
            options: (value: any) => {
                const password = typeof value === 'string' ? value : '';
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-])[A-Za-z\d@$!%*?&#\-]{8,16}$/.test(password);
            },
            errorMessage: "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
        }
    },
    registrationDate: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Registration date cannot be empty"
        },
        matches: {
            options: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/,
            errorMessage: "Birthdate must be in the format YYYY-MM-DD"
        },
    },
    idStore: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idStore must be a positive integer",
        },
        toInt: true
    },
    idPosition: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idPosition must be a positive integer",
        },
        toInt: true
    }
}

export {
    createEmployeeSchema
};