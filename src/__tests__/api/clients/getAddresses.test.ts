import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import db from "../../../models";
import { insertE2EGetAddressesTestData } from "../../../test_data/e2e/clients_test_data";
import { HttpStatusCodes } from "../../../types/enums/http";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

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

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).get(`/api/clients/${idClient}/addresses`);
        
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app).get(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a ADMINISTRATOR role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app).get(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => { 
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app).get(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});