import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ECreatePaymentMethodTestData } from "../../../test_data/e2e/clients_test_data";
import { CreatePaymentMethodCodes } from "../../../types/enums/error_codes";
import { CreatePaymentMethodMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/client/:idClient/payment-methods", () => {
    let app: Express;
    let idClient: number = 1;
    let idIssuer: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreatePaymentMethodTestData();
        idClient = testDataResult.idClient;
        idIssuer = testDataResult.idIssuer;
    });

    it("Should register the payment method in database", async () => {
        const paymentMethodData = {
            cardholderName: "Michael Davis",
            expirationMonth: "07",
            expirationYear: "26",
            encryptedCardNumber: "zxcvbnm12345678asdfghj",
            hashedCardNumber: "b28f9e746c3da7b1f72a4ab4e4cb1b438c0d704c557f9b9b7f1e45b8f83d6a26",
            initialVector: "lmn987rst321",
            authenticationTag: "uvw654xyz789",
            idIssuer: idIssuer
        };
        const response = await request(app).post(`/api/client/${idClient}/payment-methods`).send(paymentMethodData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should display an error message indicating that the client does not exist", async () => {
        const paymentMethodData = {
            cardholderName: "Alice Johnson",
            expirationMonth: "08",
            expirationYear: "26",
            encryptedCardNumber: "zxcvbnm12345678asdfghi",
            hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
            initialVector: "pqr123lmn456",
            authenticationTag: "ghi789klm456",
            idIssuer: idIssuer
        };
        const response = await request(app).post(`/api/client/${idClient+1}/payment-methods`).send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(CreatePaymentMethodMessages.CLIENT_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreatePaymentMethodCodes.CLIENT_NOT_FOUND);
    });

    it("Should display an error message indicating that the issuer does not exist", async () => {
        const paymentMethodData = {
            cardholderName: "Alice Johnson",
            expirationMonth: "08",
            expirationYear: "26",
            encryptedCardNumber: "zxcvbnm12345678asdfghi",
            hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
            initialVector: "pqr123lmn456",
            authenticationTag: "ghi789klm456",
            idIssuer: idIssuer+1
        };
        const response = await request(app).post(`/api/client/${idClient}/payment-methods`).send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(CreatePaymentMethodMessages.ISSUER_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreatePaymentMethodCodes.ISSUER_NOT_FOUND);
    });

    it("Should display an error message indicating that the payment method already exists", async () => {
        const paymentMethodData = {
            cardholderName: "Alice Johnson",
            expirationMonth: "08",
            expirationYear: "26",
            encryptedCardNumber: "zxcvbnm12345678asdfghi",
            hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
            initialVector: "pqr123lmn456",
            authenticationTag: "ghi789klm456",
            idIssuer: idIssuer
        };
        const response = await request(app).post(`/api/client/${idClient}/payment-methods`).send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(CreatePaymentMethodMessages.PAYMENT_METHOD_ALREADY_EXISTS);
        expect(response.body.errorCode).toBe(CreatePaymentMethodCodes.PAYMENT_METHOD_ALREADY_EXISTS);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });

        const paymentMethodData = {
            cardholderName: "Alice Johnson",
            expirationMonth: "08",
            expirationYear: "26",
            encryptedCardNumber: "zxcvbnm12345678asdfghi",
            hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
            initialVector: "pqr123lmn456",
            authenticationTag: "ghi789klm456",
            idIssuer: idIssuer
        };
        const response = await request(app).post(`/api/client/${idClient}/payment-methods`).send(paymentMethodData);
        
        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            port: 1433,
            dialect: 'mssql',
        });
        await db.sequelize.close();
    });
});