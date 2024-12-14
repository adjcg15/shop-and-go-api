import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ECreateOrderTestData } from "../../../test_data/e2e/orders_test_data";

describe("/api/orders", () => {
    let app: Express;
    let idClient: number = 1;
    let idPaymentMethod: number = 1;
    let idDeliveryAddress: number = 1;
    let idStore: number = 1;
    let idCheese: number = 1;
    let idMilk: number = 1;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreateOrderTestData();
        idClient = testDataResult.idClient;
        idPaymentMethod = testDataResult.idPaymentMethod;
        idDeliveryAddress = testDataResult.idDeliveryAddress
        idStore = testDataResult.idStore;
        idCheese = testDataResult.idCheese;
        idMilk = testDataResult.idMilk;

        const sessionBody = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(sessionBody);
        const client = response.body;
        token = client.token;
    });

    it("Should register the order in database", async () => {
        const orderData = {
            idStore,
            idClient,
            idDeliveryAddress,
            idPaymentMethod,
            products: [
                {
                    idProduct: idCheese, 
                    amount: 5, 
                },
                {
                    idProduct: idMilk, 
                    amount: 5
                }
            ]
        };
        const response = await request(app).post(`/api/orders`).set("Authorization", `Bearer ${token}`).send(orderData);

        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});