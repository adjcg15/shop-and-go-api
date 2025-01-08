import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetStoreInventoriesTestData } from "../../../test_data/e2e/stores_test_data";
import { error } from "console";

describe("/api/stores/:idStore/inventories", () => {
    let app: Express;
    let idStore: number = 1;
    let idMilk: number = 1;
    let idCheese: number = 1;
    let idPineapleCan: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetStoreInventoriesTestData();
        idStore = testDataResult.idStore;
        idMilk = testDataResult.idMilk;
        idCheese = testDataResult.idCheese;
        idPineapleCan = testDataResult.idPineapleCan;
    });

    it("Should return an array of 3 products id with stock registered in database", async () => {
        const products = {
            productsId: [
                idStore,
                idMilk,
                idCheese
            ]
        };

        const response = await request(app).get(`/api/stores/${idStore}/inventories`).send(products);
        const productsStock = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(productsStock)).toBe(true);
        expect(productsStock.length).toBe(3);
        productsStock.forEach((productStock:any) => {
            expect(productStock).toMatchObject({
                idProduct: expect.any(Number),
                stock: expect.any(Number)
            });
        });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});