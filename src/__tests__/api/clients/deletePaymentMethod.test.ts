import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EDeletePaymentMethodTestData } from "../../../test_data/e2e/clients_test_data";
import { PaymentMethodErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/client/:idClient/payment-methods/:idPaymentMethod", () => {
    let app: Express;
    let idClient: number = 1;
    let idPaymentMethod: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EDeletePaymentMethodTestData();
        idClient = testDataResult.idClient;
        idPaymentMethod = testDataResult.idPaymentMethod;
    });

    it("Should delete the payment method in database", async () => {
        const response = await request(app).delete(`/api/client/${idClient}/payment-methods/${idPaymentMethod}`);
        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should display an error message indicating that the client does not exist", async () => {
        const response = await request(app).delete(`/api/client/${idClient+1}/payment-methods/${idPaymentMethod}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.CLIENT_NOT_FOUND);
        expect(response.body.errorCode).toBe(PaymentMethodErrorCodes.CLIENT_NOT_FOUND);
    });

    it("Should display an error message indicating that the payment method does not exist", async () => {
        const response = await request(app).delete(`/api/client/${idClient}/payment-methods/${idPaymentMethod+1}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.PAYMENT_METHOD_NOT_FOUND);
        expect(response.body.errorCode).toBe(PaymentMethodErrorCodes.PAYMENT_METHOD_NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const response = await request(app).delete(`/api/client/${idClient}/payment-methods/${idPaymentMethod}`);

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