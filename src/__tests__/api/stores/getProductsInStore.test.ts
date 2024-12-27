import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EGetProductsByStoreTestData } from "../../../test_data/e2e/stores_test_data";

describe("/api/stores/:idStore/products", () => {
    let app: Express;
    let idStore: number = 1;
    let idDairyCategory: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EGetProductsByStoreTestData();
        idStore = testDataResult.idStore;
        idDairyCategory = testDataResult.idDairyCategory;
    });

    it("Should return an array of 5 products registered in store", async () => {
        const EXPECTED_TOTAL_PRODUCTS = 5;
        const response = await request(app).get(`/api/stores/${idStore}/products`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(EXPECTED_TOTAL_PRODUCTS);
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

            expect(product.inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    it("Should apply category filter and return an array of 3 products registered in store", async () => {
        const EXPECTED_TOTAL_DAIRY_PRODUCTS = 3;
        const response = await request(app).get(`/api/stores/${idStore}/products?categoryFilter=${idDairyCategory}`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(EXPECTED_TOTAL_DAIRY_PRODUCTS);
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

            expect(product.inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    it("Should apply search query filter and return an array of 2 products registered in store", async () => {
        const EXPECTED_TOTAL_PRODUCTS = 2;
        const response = await request(app).get(`/api/stores/${idStore}/products?query=at`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(EXPECTED_TOTAL_PRODUCTS);
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

            expect(product.inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    it("Should apply limit filter and return an array of 3 products registered in store", async () => {
        const EXPECTED_TOTAL_PRODUCTS = 3;
        const response = await request(app).get(`/api/stores/${idStore}/products?limit=3`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(EXPECTED_TOTAL_PRODUCTS);
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

            expect(product.inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    it("Should apply offset filter and return an array of 2 products registered in store", async () => {
        const EXPECTED_TOTAL_PRODUCTS = 2;
        const response = await request(app).get(`/api/stores/${idStore}/products?offset=3`);
        const products = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(EXPECTED_TOTAL_PRODUCTS);
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

            expect(product.inventory).toMatchObject({
                id: expect.any(Number),
                stock: expect.any(Number),
                expirationDate: expect.any(String),
                idProduct: expect.any(Number),
                idStore: expect.any(Number)
            });
        });
    });

    it("Should validate category filter value and return an array of feedback messages", async () => {
        const response = await request(app).get(`/api/stores/${idStore}/products?categoryFilter=0`);
        const error = response.body;

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details.length).toBeGreaterThan(0);
    });

    it("Should validate limit filter value and return an array of feedback messages", async () => {
        const response = await request(app).get(`/api/stores/${idStore}/products?limit=juan`);
        const error = response.body;

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details.length).toBeGreaterThan(0);
    });

    it("Should validate offset filter value and return an array of feedback messages", async () => {
        const response = await request(app).get(`/api/stores/${idStore}/products?offset=juan`);
        const error = response.body;

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details.length).toBeGreaterThan(0);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        
        const response = await request(app).get(`/api/issuing-banks`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});