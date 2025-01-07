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
});