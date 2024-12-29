import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import db from "../../../models";
import { insertE2EDeleteAddressTestData } from "../../../test_data/e2e/clients_test_data";
import { HttpStatusCodes } from "../../../types/enums/http";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { DeleteAddressErrorCodes } from "../../../types/enums/error_codes";

describe("/api/clients/:idClient/addresses/:idAddress", () => {
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

    afterAll(async () => {
        await db.sequelize.close();
    });
});
