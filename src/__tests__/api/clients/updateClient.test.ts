import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EUpdateClientTestData } from "../../../test_data/e2e/clients_test_data";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

describe("PATCH /api/clients/:idClient", () => {
    let app: Express;
    let idClient: number;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EUpdateClientTestData();
        idClient = testDataResult.idClient;

        const session = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const client = response.body;
        token = client.token;
    });

    it("Should update both the client's full name and birthdate", async () => {
        const NEW_FULL_NAME = "Jane Doe";
        const NEW_BIRTHDATE = "1995-05-15";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: NEW_FULL_NAME, birthdate: NEW_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should update only the client's full name", async () => {
        const NEW_FULL_NAME = "Jane Doe";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: NEW_FULL_NAME });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should update only the client's birthdate", async () => {
        const NEW_BIRTHDATE = "1995-05-15";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ birthdate: NEW_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should return an error if no field is sent to update", async () => {
        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error if the token is invalid", async () => {
        const INVALID_TOKEN = "invalid.token.here";
        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${INVALID_TOKEN}`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).patch(`/api/clients/${idClient}`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under an ADMINISTRATOR role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should return an error if birthdate is not in the format YYYY-MM-DD", async () => {
        const INVALID_BIRTHDATE = "15-05-1995";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ birthdate: INVALID_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if birthdate is not between 18 and 120 years ago", async () => {
        const INVALID_BIRTHDATE = "1800-01-01";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ birthdate: INVALID_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error if full name contains invalid characters", async () => {
        const INVALID_FULL_NAME = "Jane123 Doe!";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: INVALID_FULL_NAME });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error if full name does not contain at least a first name and a last name", async () => {
        const INVALID_FULL_NAME = "Jane";

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: INVALID_FULL_NAME });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();

        const response = await request(app).patch(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: "Jane Doe" });

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});