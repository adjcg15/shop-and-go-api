import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EDeletePaymentMethodTestData } from "../../../test_data/e2e/clients_test_data";
import { DeletePaymentMethodErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/clients/:idClient/payment-methods/:idPaymentMethod", () => {
    let app: Express;
    let idClient: number = 1;
    let idPaymentMethod: number = 1;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EDeletePaymentMethodTestData();
        idClient = testDataResult.idClient;
        idPaymentMethod = testDataResult.idPaymentMethod;

        const sessionBody = {phoneNumber: "1234567890", password: "e28e706c22b1cbefdf3972ff26db7af92181267e45735b00dbdf805080e61f3e"};
        const response = await request(app).post(`/api/sessions`).send(sessionBody);
        const client = response.body;
        token = client.token;
    });

    it("Should delete the payment method in database", async () => {
        const response = await request(app).delete(`/api/clients/${idClient}/payment-methods/${idPaymentMethod}`)
        .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should display an error message indicating that the client does not exist", async () => {
        const response = await request(app).delete(`/api/clients/${idClient+1}/payment-methods/${idPaymentMethod}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.CLIENT_NOT_FOUND);
        expect(response.body.errorCode).toBe(DeletePaymentMethodErrorCodes.CLIENT_NOT_FOUND);
    });

    it("Should display an error message indicating that the payment method does not exist", async () => {
        const response = await request(app).delete(`/api/clients/${idClient}/payment-methods/${idPaymentMethod+1}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.PAYMENT_METHOD_NOT_FOUND);
        expect(response.body.errorCode).toBe(DeletePaymentMethodErrorCodes.PAYMENT_METHOD_NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const response = await request(app).delete(`/api/clients/${idClient}/payment-methods/${idPaymentMethod}`)
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