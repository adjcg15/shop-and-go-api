import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetNearestStoreTestData } from "../../../test_data/e2e/stores_test_data";
import { ErrorMessages } from "../../../types/enums/error_messages";
import Store from "../../../models/Store";

describe("POST /api/stores/nearest-store", () => {
    let app: Express;
    let nearestStore: Store;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        nearestStore = await insertE2EGetNearestStoreTestData();
    });

    it("Should return the nearest store to the given coordinates", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 19.5287648,
                longitude: -96.92192879999999,
            });

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body).toMatchObject({
            name: nearestStore.name,
            address: nearestStore.address,
            latitude: nearestStore.latitude,
            longitude: nearestStore.longitude,
        });
    });

    it("Should display an error message indicating that there are no stores within 5km radius", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 27.931106,
                longitude: -110.940302,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.NO_STORE_NEARBY);
    });

    it("Should return 404 code indicating that no stores are registered", async () => {
        await db.Store.destroy({ where: {} });

        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 19.5287648,
                longitude: -96.92192879999999,
            });

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error if latitude is missing", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                longitude: -96.92192879999999,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if longitude is missing", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 19.5287648,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if latitude is not a float", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: "invalid",
                longitude: -96.92192879999999,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if longitude is not a float", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 19.5287648,
                longitude: "invalid",
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if latitude is out of range", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 100,
                longitude: -96.92192879999999,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should return an error if longitude is out of range", async () => {
        const response = await request(app)
            .post("/api/stores/nearest-store")
            .send({
                latitude: 19.5287648,
                longitude: 200,
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});
