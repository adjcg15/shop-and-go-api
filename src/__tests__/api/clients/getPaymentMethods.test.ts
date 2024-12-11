import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetPaymentMethodsTestData } from "../../../test_data/e2e/clients_test_data";
import { CreatePaymentMethodErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/clients/:idClient/payment-methods", () => {
    let app: Express;
    let idClient: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetPaymentMethodsTestData();
        idClient = testDataResult.idClient;
    });

    it("Should return an array of 3 payment methods registered in database", async () => {
        const response = await request(app).get(`/api/clients/${idClient}/payment-methods`);
        const paymentMethods = response.body;
        
        paymentMethods.forEach((paymentMethod: any) => {
            expect(paymentMethod).toMatchObject({
                id: expect.any(Number),
                expirationYear: expect.any(Number),
                expirationMonth: expect.any(Number),
                encryptedCardNumber: expect.any(String),
                hashedCardNumber: expect.any(String),
                initialVector: expect.any(String),
                authenticationTag: expect.any(String),
                cardholderName: expect.any(String),
                isActive: expect.any(Boolean),
            });
        
            expect(paymentMethod.issuer).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
            });
        });        
    });

    it("Should display an error message indicating that the client does not exist", async () => {
        const response = await request(app).get(`/api/clients/${idClient+1}/payment-methods`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.CLIENT_NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const response = await request(app).get(`/api/clients/${idClient}/payment-methods`);

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