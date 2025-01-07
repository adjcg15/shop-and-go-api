import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EDeliverOrderTestData } from "../../../test_data/e2e/orders_test_data";

describe ("POST api/orders/deliveries", () => {
    let app: Express;
    let token: string;
    let idDeliveredStatus: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EDeliverOrderTestData();

        const session = { username: "jlopez123", password: "hola" };
        const response = await request(app).post(`/api/sessions`).send(session);
        const employee = response.body;
        token = employee.token;

        idDeliveredStatus = testDataResult.idDeliveredStatus;
    });
})