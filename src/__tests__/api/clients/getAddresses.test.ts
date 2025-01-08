import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import db from "../../../models";
import { insertE2EGetAddressesTestData } from "../../../test_data/e2e/clients_test_data";
import { HttpStatusCodes } from "../../../types/enums/http";

describe("GET /api/clients/:idClient/addresses", () => {
    let app: Express;
    let idClient: number;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetAddressesTestData();
        idClient = testDataResult.idClient;

        const session = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const client = response.body;
        token = client.token;
    });

    it("Should return an array of 3 addresses registered in database", async () => {
        const EXPECTED_TOTAL_ADDRESES = 3;
        const response = await request(app).get(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`);
        const addresses = response.body;
        
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(addresses)).toBe(true);
        expect(addresses.length).toBe(EXPECTED_TOTAL_ADDRESES);
        addresses.forEach((address: any) => {
            expect(address).toMatchObject({
                id: expect.any(Number),
                street: expect.any(String),
                streetNumber: expect.any(String),
                neighborhood: expect.any(String),
                municipality: expect.any(String),
                city: expect.any(String),
                postalCode: expect.any(String),
                state: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number)
            });

            if (address.hasOwnProperty('apartmentNumber')) {
                expect(address.apartmentNumber).toEqual(expect.any(String));
            }
        });        
    });

    it("Should return an error if the token is invalid", async () => {
        const INVALID_TOKEN = "invalid.token.here";
        const response = await request(app).get(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${INVALID_TOKEN}`);
        
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});