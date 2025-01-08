import request from "supertest";
import { Express } from "express";
import createApp from "../../../lib/app";
import db from "../../../models";
import { insertE2EUpdateProductCategoryTestData } from "../../../test_data/e2e/product_categories_test_data";
import { signToken } from "../../../lib/token_store";
import UserRoles from "../../../types/enums/user_roles";
import { HttpStatusCodes } from "../../../types/enums/http";

describe("PATCH /api/product-categories/:idCategory", () => {
    let app: Express;
    let idCategory = 0;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const category = await insertE2EUpdateProductCategoryTestData();
        idCategory = category.idCategory;
    });

    it("Should avoid category update under a GUEST request", async () => {
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .send({ name: "New test name" });

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should avoid category update under a CLIENT request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.CLIENT });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "New test name" });

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid category update under a SALES EXECUTIVE request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "New test name" });

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should avoid category update under a DELIVERY MAN request", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.SALES_EXECUTIVE });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "New test name" });

        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should omit any category update when no body is sent", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should validate idCategory parameter format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/juan`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate idCategory parameter existance", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/1000000`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "test name" });

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(typeof response.body.details).toBe("string");
    });

    it("Should validate empty name body value", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "        " });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate name body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "nombre_malo" });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should validate isActive body value format", async () => {
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ isActive: "invalido" });

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(Array.isArray(response.body.details)).toBe(true);
    });

    it("Should update name only", async () => {
        const newCategoryName = "Lacteos y quesos";
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: newCategoryName });
        const newCategory = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(newCategory).toMatchObject({
            id: idCategory,
            name: newCategoryName,
            isActive: true
        });
    });

    it("Should update isActive value only", async () => {
        const newIsActiveValue = false;
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ isActive: newIsActiveValue });
        const newCategory = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(newCategory).toMatchObject({
            id: idCategory,
            name: "Lacteos y quesos",
            isActive: newIsActiveValue
        });
    });

    it("Should update all category", async () => {
        const newCategoryName = "Lacteos y derivados";
        const newIsActiveValue = true;
        const token = signToken({ id: 1, userRole: UserRoles.ADMINISTRATOR });
        const response = await request(app)
            .patch(`/api/product-categories/${idCategory}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ isActive: newIsActiveValue, name: newCategoryName });
        const newCategory = response.body;

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(newCategory).toMatchObject({
            id: idCategory,
            name: newCategoryName,
            isActive: newIsActiveValue
        });
    });
});