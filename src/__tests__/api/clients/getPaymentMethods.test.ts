import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetPaymentMethodsTestData } from "../../../test_data/e2e/clients_test_data";
import { Sequelize } from "sequelize";

describe("/api/clients/:idClient/payment-methods", () => {
    let app: Express;
    let idClient: number = 1;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetPaymentMethodsTestData();
        idClient = testDataResult.idClient;

        const sessionBody = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(sessionBody);
        const client = response.body;
        token = client.token;
    });

    it("Should return an array of 3 payment methods registered in database", async () => {
        const response = await request(app).get(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`);
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

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const response = await request(app).get(`/api/clients/${idClient}/payment-methods`)
            .set("Authorization", `Bearer ${token}`);

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