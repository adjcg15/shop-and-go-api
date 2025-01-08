import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetProductTestData } from "../../../test_data/e2e/products_test_data";

describe("/api/products", () => {
    let app: Express;
    let barCode: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetProductTestData();
        barCode = testDataResult.barCode;
    });

    it("Should return an product registered in database", async () => {
        const response = await request(app).get(`/api/products/${barCode}`);
        const product = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(product).toMatchObject({
            id: expect.any(Number),
            barCode: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            imageUrl: expect.any(String),
            salePrice: expect.any(Number),
            maximumAmount: expect.any(Number),
            idCategory: expect.any(Number),
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});
