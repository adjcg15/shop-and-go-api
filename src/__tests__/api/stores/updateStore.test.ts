import { Express } from "express";
import request from "supertest";
import createApp from "../../../lib/app";
import db from "../../../models";
import { HttpStatusCodes } from "../../../types/enums/http";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

describe("PUT /api/stores/:idStore", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });
    });

    it("Should avoid request under a GUEST role", async () => {
        const response = await request(app).put(`/api/stores/1`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid request under a CLIENT role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a SALES EXECUTIVE role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid request under a DELIVERY MAN role", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should validate idStore parameter format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/juan`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate name body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "wrong_format",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty name body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty address body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "",
                openingTime: "08:00:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate openingTime body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate openingTime body value outside time boundaries", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "28:00:00",
                closingTime: "12:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty openingTime body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "",
                closingTime: "22:00:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate closingTime body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "12:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate closingTime body value outside time boundaries", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "13:78:00",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty closingTime body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "",
                latitude: 19.54823,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate latitude body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: "juan",
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty latitude body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: "",
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate latitude body value outside boundaries", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: 91,
                longitude: -96.93329
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate longitude body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: 19.54823,
                longitude: "juan"
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate not empty longitude body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: 19.54823,
                longitude: ""
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate longitude body value outside boundaries", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .put(`/api/stores/1`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New store name",
                address: "New store address",
                openingTime: "08:00:00",
                closingTime: "22:00:00",
                latitude: 19.54823,
                longitude: -190
            });
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });
});