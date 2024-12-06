import { Schema } from "express-validator";

const addPaymentMethodToClientSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        toInt: true
    },
    cardholderName: {
        in: ["body"],
        isString: {
            errorMessage: "Cardholder name must be a string"
        },
        notEmpty: {
            errorMessage: "Cardholder name is required"
        }
    },
    expirationMonth: {
        in: ["body"],
        isInt: {
            errorMessage: "Expiration month must be an integer"
        },
        custom: {
            options: (value: any) => {
                const month = typeof value === 'number' ? value.toString() : value;
                return /^0[1-9]|1[0-2]$/.test(month);
            },
            errorMessage: "Expiration month must be in the format MM (01-12)"
        },
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "Expiration month must be exactly 2 digits"
        }
    },
    expirationYear: {
        in: ["body"],
        isInt: {
            errorMessage: "Expiration year must be an integer"
        },
        custom: {
            options: (value: any) => {
                const year = typeof value === 'number' ? value.toString() : value;
                const currentYear = new Date().getFullYear();
                const currentYearTwoDigits = currentYear % 100;
                const yearParsed = parseInt(year, 10);
                
                return yearParsed >= currentYearTwoDigits && yearParsed <= 99;
            },
            errorMessage: "Expiration year must be a valid future year (in format YY)"
        },
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "Expiration year must be exactly 2 digits"
        }
    },
    idIssuer: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idEmisor must be a positive integer"
        },
        toInt: true
    },
    encryptedCardNumber: {
        in: ["body"],
        isLength: {
            options: { min: 22, max: 22 },
            errorMessage: "Card number must be exactly 22 characters long"
        },
        isString: {
            errorMessage: "Card number must be a string"
        },
        matches: {
            options: /^[a-zA-Z0-9]*$/,
            errorMessage: "Card number must contain only alphanumeric characters"
        }
    },
    hashedCardNumber: {
        in: ["body"],
        isLength: {
            options: { min: 64, max: 64 },
            errorMessage: "Hashed card number must be exactly 64 characters long"
        },
        isString: {
            errorMessage: "Hashed card number must be a string"
        },
        matches: {
            options: /^[a-fA-F0-9]*$/,
            errorMessage: "Hashed card number must contain only hexadecimal characters"
        }
    },
    initialVector: {
        in: ["body"],
        isLength: {
            options: { min: 12, max: 12 },
            errorMessage: "Initialization Vector must be exactly 12 characters long"
        },
        isString: {
            errorMessage: "Initialization Vector must be a string"
        },
        matches: {
            options: /^[a-zA-Z0-9]*$/,
            errorMessage: "Initialization Vector must contain only alphanumeric characters"
        }
    },
    authenticationTag: {
        in: ["body"],
        isLength: {
            options: { min: 12, max: 12 },
            errorMessage: "Initialization Vector must be exactly 12 characters long"
        },
        isString: {
            errorMessage: "Initialization Vector must be a string"
        },
        matches: {
            options: /^[a-zA-Z0-9]*$/,
            errorMessage: "Initialization Vector must contain only alphanumeric characters"
        }
    }
};

const deletePaymentMethodFromClientSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        toInt: true
    },
    idPaymentMethod: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        toInt: true
    }
}

const getPaymentMethodsFromClientSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        toInt: true
    }
}

export { 
    addPaymentMethodToClientSchema,
    deletePaymentMethodFromClientSchema,
    getPaymentMethodsFromClientSchema 
};