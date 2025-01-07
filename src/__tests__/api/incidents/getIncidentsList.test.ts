import { Express } from "express";
import request from "supertest";
import createApp from "../../../lib/app";
import db from "../../../models";
import { insertE2EGetIncidentsListTestData } from "../../../test_data/e2e/incidents_test_data";
import { HttpStatusCodes } from "../../../types/enums/http";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

describe("GET /api/incidents", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EGetIncidentsListTestData();
    });

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).get(`/api/incidents`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a CLIENT role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .get(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .get(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .get(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should validate offset filter format and return an array of feedback messages", async () => {
        const response = await request(app).get(`/api/incidents?offset=juan`);
        const error = response.body;

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details.length).toBeGreaterThan(0);
    });

    it("Should validate limit filter format and return an array of feedback messages", async () => {
        const response = await request(app).get(`/api/incidents?offset=juan`);
        const error = response.body;

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details.length).toBeGreaterThan(0);
    });

    it("Should return an array of 3 product categories registered in database", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .get(`/api/incidents`)
            .set("Authorization", `Bearer ${token}`);
        const incidentsSummary = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(incidentsSummary.count).toBe(3);
        incidentsSummary.incidents.forEach((incident:any) => {
            expect(incident).toMatchObject({
                id: expect.any(Number),
                creationDate: expect.any(String),
                reason: expect.any(String),
                idOrder: expect.any(Number),
            });
        });
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        
        const response = await request(app).get(`/api/incidents`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});