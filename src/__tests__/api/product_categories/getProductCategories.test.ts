import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import UserRoles from "../../../types/enums/user_roles";
import { signToken } from "../../../lib/token_store";
import { insertE2EGetProductCategoeriesTestData } from "../../../test_data/e2e/product_categories_test_data";

describe("/api/product-categories", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EGetProductCategoeriesTestData();
    });

    it("Should return an array of 3 product categories registered in database", async () => {
        const response = await request(app).get(`/api/product-categories`);
        const productCategories = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(productCategories)).toBe(true);
        expect(productCategories.length).toBe(3);
        productCategories.forEach((productCategory:any) => {
            expect(productCategory).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                isActive: true
            });
        });
    });

    it("Should return an array of 3 product categories registered in database", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .get(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`);
        const productCategories = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(productCategories)).toBe(true);
        expect(productCategories.length).toBe(3);
        productCategories.forEach((productCategory:any) => {
            expect(productCategory).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                isActive: true
            });
        });
    });

    it("Should return an array of 5 all product categories registered in database", async() => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .get(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`);
        const productCategories = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(productCategories)).toBe(true);
        productCategories.forEach((productCategory:any) => {
            expect(productCategory).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                isActive: expect.any(Boolean)
            });
        });
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalid-host",
            port: 9999,
            dialect: "mssql",
        });
        
        const response = await request(app).get(`/api/product-categories`);

        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "localhost",
            port: 1433,
            dialect: "mssql",
        });
        await db.sequelize.close();
    });
});