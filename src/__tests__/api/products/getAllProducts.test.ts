import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetAllProductsTestData } from "../../../test_data/e2e/products_test_data";

describe("/api/products", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EGetAllProductsTestData();
    });

    it("Should return an array of 3 products registered in database", async () => {
        const response = await request(app).get(`/api/products`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(3);
        products.forEach((product:any) => {
            expect(product).toMatchObject({
                id: expect.any(Number),
                barCode: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                imageUrl: expect.any(String),
                salePrice: expect.any(Number),
                maximumAmount: expect.any(Number),
                idCategory: expect.any(Number)
            });

            expect(product.category).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                isActive: expect.any(Boolean)
            });
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});