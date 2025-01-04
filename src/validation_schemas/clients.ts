import { Schema } from "express-validator";

const createClientSchema: Schema = {
    password: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Password cannot be empty"
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
    birthdate: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Birthdate cannot be empty"
        },
        matches: {
            options: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/,
            errorMessage: "Birthdate must be in the format YYYY-MM-DD"
        },
        custom: {
            options: (value: any) => {
                const birthdate = new Date(value);
                const today = new Date();
    
                const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
                const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
                return birthdate.getTime() <= maxDate.getTime() && birthdate.getTime() >= minDate.getTime()
            },
            errorMessage: "Birthdate must be between 18 and 120 years ago"
        }
    },
    fullName: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Full name cannot be empty"
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
    phoneNumber: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Phone number cannot be empty"
        },
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
    }
}

const updateClientSchema: Schema = {
    anyField: {
        custom: {
            options: (value, { req }) => {
                const { fullName, birthdate } = req.body;
                return fullName || birthdate;
            },
            errorMessage: "At least one field (fullName or birthdate) must be provided"
        }
    },
    birthdate: {
        in: ["body"],
        optional: true,
        matches: {
            options: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/,
            errorMessage: "Birthdate must be in the format YYYY-MM-DD"
        },
        custom: {
            options: (value: any) => {
                const birthdate = new Date(value);
                const today = new Date();

                const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
                const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

                return birthdate.getTime() <= maxDate.getTime() && birthdate.getTime() >= minDate.getTime();
            },
            errorMessage: "Birthdate must be between 18 and 120 years ago"
        }
    },
    fullName: {
        in: ["body"],
        optional: true,
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
    }
};


export {
    createClientSchema,
    updateClientSchema
};