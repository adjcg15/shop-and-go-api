import { Schema } from "express-validator";
import cardValidator from "card-validator";

const createPaymentMethodToClientValidationSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idClient is required",
        },
        toInt: true,
    },
    cardholderName: {
        in: ["body"],
        isLength: {
            options: { max: 64 },
            errorMessage: "Cardholder name cannot exceed 255 characters.",
        },
        isString: {
            errorMessage: "Cardholder name must be a string",
        },
        notEmpty: {
            errorMessage: "Cardholder name is required",
        },
    },
    expirationMonth: {
        in: ["body"],
        isInt: {
            errorMessage: "Expiration month must be an integer",
        },
        notEmpty: {
            errorMessage: "Expiration month is required",
        },
        custom: {
            options: (value: any) => {
                const month =
                    typeof value === "number" ? value.toString() : value;
                return /^0[1-9]|1[0-2]$/.test(month);
            },
            errorMessage: "Expiration month must be in the format MM (01-12)",
        },
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "Expiration month must be exactly 2 digits",
        },
    },
    expirationYear: {
        in: ["body"],
        isInt: {
            errorMessage: "Expiration year must be an integer",
        },
        notEmpty: {
            errorMessage: "Expiration year is required",
        },
        custom: {
            options: (value: any) => {
                const year =
                    typeof value === "number" ? value.toString() : value;
                const currentYear = new Date().getFullYear();
                const currentYearTwoDigits = currentYear % 100;
                const yearParsed = parseInt(year, 10);

                return yearParsed >= currentYearTwoDigits && yearParsed <= 99;
            },
            errorMessage:
                "Expiration year must be a valid future year (in format YY)",
        },
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "Expiration year must be exactly 2 digits",
        },
    },
    idIssuer: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idEmisor must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idIssuer is required",
        },
        toInt: true,
    },
    cardNumber: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Card number is required",
        },
        matches: {
            options:
                /^(4[0-9]{15}|5[1-5][0-9]{14}|22[2-9][0-9]{13}|2[3-7][0-9]{13})$/,
            errorMessage:
                "Card number must be a valid Visa or Mastercard number with 16 digits",
        },
        custom: {
            options: (value) => cardValidator.number(value).isValid,
            errorMessage: "Card number is not valid",
        },
    },
};

const deletePaymentMethodFromClientValidationSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idClient is required",
        },
        toInt: true,
    },
    idPaymentMethod: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idPaymentMethod is required",
        },
        toInt: true,
    },
};

const getPaymentMethodsFromClientValidationSchema: Schema = {
    idClient: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idClient must be a positive integer",
        },
        notEmpty: {
            errorMessage: "idClient is required",
        },
        toInt: true,
    },
};

export {
    createPaymentMethodToClientValidationSchema,
    deletePaymentMethodFromClientValidationSchema,
    getPaymentMethodsFromClientValidationSchema,
};
