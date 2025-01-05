import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetStoreTestData } from "../../../test_data/e2e/stores_test_data";
import { Sequelize } from "sequelize";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";

describe("GET /api/stores/:idStore", () => {
    let app: Express;
    let idStore: number = 0;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetStoreTestData();
        idStore = testDataResult.idStore;
    });

    it("Should return an store registered in database", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .get(`/api/stores/${idStore}`)
            .set("Authorization", `Bearer ${token}`);
        const store = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(store).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            address: expect.any(String),
            openingTime: expect.any(String),
            closingTime: expect.any(String),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
        });
    });

    it("Should return an eror message indicating that store with the specified id is not registered", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .get(`/api/stores/${idStore + 1}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(response.body.details).toBe(ErrorMessages.STORE_NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalid-host",
            port: 9999,
            dialect: "mssql",
        });

        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .get(`/api/stores/${idStore}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});
