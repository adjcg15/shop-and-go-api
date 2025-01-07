import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetOrdersToDeliverTestData } from "../../../test_data/e2e/orders_test_data";

describe("GET /api/orders/orders-to-deliver", () => {
    let app: Express;
    let token: string;
    let idSentStatus: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetOrdersToDeliverTestData();

        const session = { username: "jlopez123", password: "hola" };
        const response = await request(app).post(`/api/sessions`).send(session);
        const employee = response.body;
        token = employee.token;

        idSentStatus = testDataResult.idSentStatus;
    });

    it("Should return an array of orders registered in database", async () => {
        const response = await request(app)
            .get(`/api/orders/orders-to-deliver`)
            .set("Authorization", `Bearer ${token}`);

        const orders = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(orders)).toBe(true);
        orders.forEach((order:any) => {
            expect(order.idStatus).toBe(idSentStatus);
            expect(order.address).not.toBeNull;
            expect(order.client).not.toBeNull;
            expect(order.product).not.toBeNull;

            order.products.forEach((product:any) => {
                expect(product.OrderProduct).not.toBeNull;
            });
        });
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();

        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalid-host",
            port: 9999,
            dialect: "mssql",
        });
        
        const response = await request(app).get(`/api/product-categories`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

});