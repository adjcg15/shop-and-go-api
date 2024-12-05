import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetProductsByStoreTestData } from "../../../test_data/e2e/stores_test_data";

describe("/api/stores/:idStore/products", () => {
    let app: Express;
    let idStore: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetProductsByStoreTestData();
        idStore = testDataResult.idStore;
    });

    it("Should return an array of 3 products registered in database", async () => {
        const response = await request(app).get(`/api/stores/${idStore}/products`);
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
                salePrice: expect.any(Number),
                maximumAmount: expect.any(Number),
                idCategory: expect.any(Number),
                stock: expect.any(Number)
            });
            expect(product.image === null || Buffer.isBuffer(product.image)).toBe(true);
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});