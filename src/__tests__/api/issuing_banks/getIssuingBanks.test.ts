import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetIssuingBanksTestData } from "../../../test_data/e2e/stores_test_data";
import { Sequelize } from "sequelize";

describe("/api/issuing-banks", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EGetIssuingBanksTestData();
    });

    it("Should return an array of 3 issuing banks registered in database", async () => {
        const response = await request(app).get(`/api/issuing-banks`);
        const issuingBanks = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(issuingBanks)).toBe(true);
        expect(issuingBanks.length).toBe(3);
        issuingBanks.forEach((issuingBank:any) => {
            expect(issuingBank).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String)
            });
        });
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const response = await request(app).get(`/api/issuing-banks`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            port: 1433,
            dialect: 'mssql',
        });
        await db.sequelize.close();
    });
});