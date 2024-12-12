import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ECreatePaymentMethodTestData } from "../../../test_data/e2e/clients_test_data";
import { CreatePaymentMethodErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/clients/:idClient/payment-methods", () => {
    let app: Express;
    let idClient: number = 1;
    let idIssuer: number = 1;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreatePaymentMethodTestData();
        idClient = testDataResult.idClient;
        idIssuer = testDataResult.idIssuer;
        const sessionBody = {phoneNumber: "1234567890", password: "e28e706c22b1cbefdf3972ff26db7af92181267e45735b00dbdf805080e61f3e"};
        const response = await request(app).post(`/api/sessions`).send(sessionBody);
        const client = response.body;
        token = client.token;
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
        const response = await request(app).post(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`)
            .send(paymentMethodData);
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
        const response = await request(app).post(`/api/clients/${idClient+1}/payment-methods`)
            .set("Authorization", `Bearer ${token}`)
            .send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.CLIENT_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreatePaymentMethodErrorCodes.CLIENT_NOT_FOUND);
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
        const response = await request(app).post(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`)
            .send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.ISSUER_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreatePaymentMethodErrorCodes.ISSUER_NOT_FOUND);
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
        const response = await request(app).post(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`)
            .send(paymentMethodData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.PAYMENT_METHOD_ALREADY_EXISTS);
        expect(response.body.errorCode).toBe(CreatePaymentMethodErrorCodes.PAYMENT_METHOD_ALREADY_EXISTS);
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
        const response = await request(app).post(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`)
            .send(paymentMethodData);
        
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