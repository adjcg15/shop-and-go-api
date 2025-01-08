import request from "supertest"
import { Express } from "express";
import createApp from "../../../lib/app";
import db from "../../../models";
import { HttpStatusCodes } from "../../../types/enums/http";
import UserRoles from "../../../types/enums/user_roles";
import { signToken } from "../../../lib/token_store";
import { insertE2ECreateIncidentTestData } from "../../../test_data/e2e/incidents_test_data";
import { ErrorMessages } from "../../../types/enums/error_messages";

describe("POST /api/incidents", () => {
    let app: Express;
    let idOrder = 0;
    let idDeliveryManOwner = 0;
    let idDeliveryMan = 0;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const dbResults = await insertE2ECreateIncidentTestData();
        idOrder = dbResults.idOrder;
        idDeliveryManOwner = dbResults.idDeliveryManOwner;
        idDeliveryMan = dbResults.idDeliveryMan;
    });

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).post(`/api/incidents`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a CLIENT role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under ADMINISTRATOR role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should validate idOrder not empty body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                reason: "New incident reason"
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it("Should validate idOrder body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                idOrder: "juan",
                reason: "New incident reason"
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it("Should validate reason not empty body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                idOrder: 1,
                reason: ""
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it("Should validate delivery man ownering of order", async () => {
        const token = signToken({ id: idDeliveryMan, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                idOrder,
                reason: "New reason"
            });

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(response.body.details).toBe(ErrorMessages.ORDER_NOT_FOUND);
    });

    it("Should create incident", async () => {
        const token = signToken({ id: idDeliveryManOwner, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                idOrder,
                reason: "New reason"
            });

        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            creationDate: expect.any(String),
            reason: "New reason"
        });
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        await db.sequelize.close();
        
        const response = await request(app)
            .post(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                idOrder,
                reason: "Mock reason"
            });

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});