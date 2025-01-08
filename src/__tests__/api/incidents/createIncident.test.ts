import request from "supertest"
import { Express } from "express";
import createApp from "../../../lib/app";
import db from "../../../models";
import { HttpStatusCodes } from "../../../types/enums/http";
import UserRoles from "../../../types/enums/user_roles";
import { signToken } from "../../../lib/token_store";

describe("POST /api/incidents", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });
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
});