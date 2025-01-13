import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import db from "../../../models";
import { insertE2EDeleteAddressTestData } from "../../../test_data/e2e/clients_test_data";
import { HttpStatusCodes } from "../../../types/enums/http";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { DeleteAddressErrorCodes } from "../../../types/enums/error_codes";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

describe("DELETE /api/clients/:idClient/addresses/:idAddress", () => {
    let app: Express;
    let idClient: number;
    let idAddress: number;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EDeleteAddressTestData();
        idClient = testDataResult.idClient;
        idAddress = testDataResult.idAddress;

        const session = { phoneNumber: "1234567890", password: "password12345" };
        const response = await request(app).post(`/api/sessions`).send(session);
        const client = response.body;
        token = client.token;
    });

    it("Should delete the address for the client", async () => {
        const response = await request(app).delete(`/api/clients/${idClient}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should display an error message indicating that the address does not exist", async () => {
        const NON_EXISTENT_ADDRESS_ID = 9999;
        const response = await request(app).delete(`/api/clients/${idClient}/addresses/${NON_EXISTENT_ADDRESS_ID}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.ADDRESS_NOT_FOUND);
        expect(response.body.errorCode).toBe(DeleteAddressErrorCodes.DELIVERY_ADDRESS_NOT_FOUND);
    });

    it("Should display an error message indicating that idClient must be a positive integer", async () => {        
        const INVALID_ID_CLIENT = -1;

        const token = signToken({ id: -1, userRole: UserRoles.CLIENT });
        const response = await request(app).delete(`/api/clients/${INVALID_ID_CLIENT}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should display an error message indicating that idAddress must be a positive integer", async () => {
        const INVALID_ID_ADDRESS = -1;
        const response = await request(app).delete(`/api/clients/${idClient}/addresses/${INVALID_ID_ADDRESS}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).delete(`/api/clients/${idClient}/addresses/${idAddress}`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request from a different client than the one authenticated", async () => {
        const INVALID_ID_CLIENT = 9999;
        const response = await request(app).delete(`/api/clients/${INVALID_ID_CLIENT}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .delete(`/api/clients/${idClient}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .delete(`/api/clients/${idClient}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a ADMINISTRATOR role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .delete(`/api/clients/${idClient}/addresses/${idAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });
});
