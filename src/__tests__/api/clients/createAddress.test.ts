import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { insertE2ECreateAddressTestData } from '../../../test_data/e2e/clients_test_data';
import { ErrorMessages } from '../../../types/enums/error_messages';
import { HttpStatusCodes } from '../../../types/enums/http';

describe ("POST api/clients/:idClient/addresses", () => {
    let app: Express;
    let idClient: number;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreateAddressTestData();
        idClient = testDataResult.idClient;

        const session = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const client = response.body;
        token = client.token;
    });

    it("Should register the address in database and return the id", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };
        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ idAddress: expect.any(Number) });
    });

    it("Should display an error message if no store is nearby", async () => {
        const addressData = {
            street: "Sixth Street",
            streetNumber: "3033",
            neighborhood: "Uptown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "67890",
            state: "State",
            latitude: 0.0,
            longitude: 0.0
        };
        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.NO_STORE_NEARBY);
    });
});