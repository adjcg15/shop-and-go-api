import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { insertE2ECreateAddressTestData } from '../../../test_data/e2e/clients_test_data';
import { ErrorMessages } from '../../../types/enums/error_messages';
import { HttpStatusCodes } from '../../../types/enums/http';
import { signToken } from '../../../lib/token_store';
import UserRoles from '../../../types/enums/user_roles';

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

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).post(`/api/clients/${idClient}/addresses`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a ADMINISTRATOR role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app).post(`/api/clients/1/addresses`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app).post(`/api/clients/1/addresses`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN});
        const response = await request(app).post(`/api/clients/1/addresses`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should validate not empty street body value", async () => {
        const addressData = {
            street: "",
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate street body value length", async () => {
        const addressData = {
            street: "a".repeat(256),
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty streetNumber body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "",
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate streetNumber body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "a".repeat(6),
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate apartmentNumber body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            apartmentNumber: "a".repeat(6),
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate apartmentNumber body value with invalid characters", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            apartmentNumber: "123@!",
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty neighborhood body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "",
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate neighborhood body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "a".repeat(256),
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

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty municipality body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate municipality body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "a".repeat(256),
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty city body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate city body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "a".repeat(256),
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty postalCode body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate postalCode body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "123456",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate postalCode body value with invalid characters", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "1234a",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty state body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it ("Should validate state body value length", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "a".repeat(256),
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);

        expect (response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty latitude body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: "",
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate latitude body value with invalid characters", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: "abc",
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate latitude body value with invalid range", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 91.0,
            longitude: -96.92192879999999,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty longitude body value", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: "",
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate longitude body value with invalid characters", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: "abc",
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate longitude body value with invalid range", async () => {
        const addressData = {
            street: "Fourth Street",
            streetNumber: "1011",
            neighborhood: "Midtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "12345",
            state: "State",
            latitude: 19.5287648,
            longitude: 181.0,
        };

        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();

        const addressData = {
            street: "Fifth Street",
            streetNumber: "2022",
            neighborhood: "Downtown",
            municipality: "City",
            city: "Metropolis",
            postalCode: "54321",
            state: "State",
            latitude: 19.5287648,
            longitude: -96.92192879999999,
        };
        const response = await request(app).post(`/api/clients/${idClient}/addresses`)
            .set("Authorization", `Bearer ${token}`)
            .send(addressData);
        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
});