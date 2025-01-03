import { Express } from "express";
import request from "supertest";
import createApp from "../../../lib/app";
import db from "../../../models";
import { HttpStatusCodes } from "../../../types/enums/http";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";
import { insertE2ECreateProductCategoryTestData } from "../../../test_data/e2e/product_categories_test_data";
import { ErrorMessages } from "../../../types/enums/error_messages";

describe("POST /api/product-categories", () => {
    let app: Express;
    let registeredCategoryName = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const categoryRegistered = await insertE2ECreateProductCategoryTestData();
        registeredCategoryName = categoryRegistered.categoryName;
    });

    it("Should avoid category update under a GUEST request", async () => {
        const response = await request(app).post(`/api/product-categories`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid category update under a CLIENT request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid category update under a SALES EXECUTIVE request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid category update under a DELIVERY MAN request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.DELIVERY_MAN });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should validate empty name body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "        ", isActive: true });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate name body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "nombre_malo", isActive: true });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate isActive body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Nueva categoría", isActive: "invalido" });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate category name already in use", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: registeredCategoryName, isActive: true });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.DUPLICATED_PRODUCT_CATEGORY);
    });

    it("Should create category", async () => {
        const newCategoryName = "Enlatados";
        const newCategoryActiveState = true;
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .post(`/api/product-categories`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: newCategoryName, isActive: newCategoryActiveState });
        const newCategory = response.body;

        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(newCategory).toMatchObject({
            id: expect.any(Number),
            name: newCategoryName,
            isActive: newCategoryActiveState
        });
    });
});