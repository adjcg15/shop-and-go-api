import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EUpdateClientTestData } from "../../../test_data/e2e/clients_test_data";

describe("PUT /api/clients/:idClient", () => {
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

        const response = await request(app).put(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: NEW_FULL_NAME, birthdate: NEW_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should update only the client's full name", async () => {
        const NEW_FULL_NAME = "Jane Doe";

        const response = await request(app).put(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: NEW_FULL_NAME });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should update only the client's birthdate", async () => {
        const NEW_BIRTHDATE = "1995-05-15";

        const response = await request(app).put(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ birthdate: NEW_BIRTHDATE });

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should return an error if no field is sent to update", async () => {
        const response = await request(app).put(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error if the token is invalid", async () => {
        const INVALID_TOKEN = "invalid.token.here";
        const response = await request(app).put(`/api/clients/${idClient}`)
            .set("Authorization", `Bearer ${INVALID_TOKEN}`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });
});