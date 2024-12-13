import { Schema } from "express-validator";

const createOrderValidationsSchema: Schema = {
    idStore: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idStore must be a positive integer",
        },
        toInt: true
    },
    idClient: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idClient must be a positive integer",
        },
        toInt: true
    },
    idDeliveryAddress: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idDeliveryAddress must be a positive integer",
        },
        toInt: true
    },
    idPaymentMethod: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idPaymentMethod must be a positive integer",
        },
        toInt: true
    },
    idStatus: {
        in: ["body"],
        isInt: {
            options: { min: 1 },
            errorMessage: "idStatus must be a positive integer",
        },
        toInt: true
    },
    products: {
        in: ["body"],
        isArray: {
            options: { min: 1 },
            errorMessage: "Products must be a non-empty array.",
        },
        custom: {
            options: (value: any) => {
                if (!Array.isArray(value)) return false;
                return value.every(item => {
                    const idProductIsValid = typeof item.idProduct === 'number' && item.idProduct > 0;
                    const amountIsValid = typeof item.amount === 'number' && item.amount > 0;
    
                    return idProductIsValid && amountIsValid;
                });
            },
            errorMessage: "Each product must have a valid idProduct (integer > 0) and amount (positive integer).",
        }
    }
}    

export {
    createOrderValidationsSchema
}