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
});