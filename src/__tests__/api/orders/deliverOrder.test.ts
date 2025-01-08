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
    let idOrder: number;
    let idAdministrator: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EDeliverOrderTestData();

        const session = { username: "jlopez123", password: "hola" };
        const response = await request(app).post(`/api/sessions`).send(session);
        const employee = response.body;
        token = employee.token;

        idDeliveredStatus = testDataResult.idDeliveredStatus;
        idOrder = testDataResult.idOrder;
        idAdministrator = testDataResult.idAdministrator;
    });

    it("should update the order sent to order deliver", async () => {
        const response = await request(app)
            .post(`/api/orders/deliveries`)
            .set("Authorization", `Bearer ${token}`)
            .send( { idOrder} );
        
        const updatedOrder = response.body;

        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(updatedOrder.idStatus).toBe(idDeliveredStatus);
        expect(updatedOrder.deliveryDate).not.toBeNull;
    });

    it("should display an error indicating that the order does not exist", async () => {
        const response = await request(app)
            .post(`/api/orders/deliveries`)
            .set("Authorization", `Bearer ${token}`)
            .send( { idOrder: 1000 } );
        
        const updatedOrder = response.body;

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should display an error indicating that the order does not exist (due to the order is not delivered by delivery man assigned)", async () => {
        const session = { username: "admin123", password: "hola" };
        const responseSession = await request(app).post(`/api/sessions`).send(session);
        const administrator = responseSession.body;
        const token = administrator.token;


        const response = await request(app)
            .post(`/api/orders/deliveries`)
            .set("Authorization", `Bearer ${token}`)
            .send( { idOrder } );
        
        const updatedOrder = response.body;

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
    
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalid-host",
            port: 9999,
            dialect: "mssql",
        });
        
        const response = await request(app).post(`/api/orders/deliveries`).set("Authorization", `Bearer ${token}`).send({ idOrder });

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "localhost",
            port: 1433,
            dialect: "mssql",
        });
        
        await db.sequelize.close();
    });
})