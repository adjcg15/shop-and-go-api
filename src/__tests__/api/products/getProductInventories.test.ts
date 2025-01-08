import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetProductInventoriesTestData } from "../../../test_data/e2e/products_test_data";

describe("/api/products/:idProduct/inventories", () => {
    let app: Express;
    let idProduct: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetProductInventoriesTestData();
        idProduct = testDataResult.idProduct;
    });

    it("Should return an array of 3 products registered in database", async () => {
        const response = await request(app).get(`/api/products/${idProduct}/inventories`);
        const inventories = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(inventories)).toBe(true);
        expect(inventories.length).toBe(3);
        inventories.forEach((inventory:any) => {
            expect(inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});