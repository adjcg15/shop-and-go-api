import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ECreateProductTestData } from "../../../test_data/e2e/products_test_data";
import { CreateProductErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/products", () => {
    let app: Express;
    let idStoreXalapa: number = 1;
    let idStoreCarranza: number = 2;
    let idCategory: number = 1;
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreateProductTestData();
        idStoreXalapa = testDataResult.idStoreXalapa;
        idStoreCarranza = testDataResult.idStoreCarranza;
        idCategory = testDataResult.idCategory;
    });

    it("Should register the product with inventories in database", async () => {
        const productData = {
            barCode: "0987654321123", 
            name: "Queso Panela Fud 400 gr",
            description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
            imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
            salePrice: 43.33,
            maximumAmount: 20,
            idCategory,
            inventories: [
                {
                    stock: 24, 
                    idStore: idStoreXalapa, 
                    expirationDate: "2024-12-24"
                },
                {
                    stock: 2, 
                    idStore: idStoreCarranza, 
                    expirationDate: "2028-12-24"
                }
            ]
        };
        const response = await request(app).post(`/api/products`).send(productData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should register the product without inventories in database", async () => {
        const productData = {
            barCode: "0987654321124", 
            name: "Queso Panela Fud 400 gr",
            description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
            imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
            salePrice: 43.33,
            maximumAmount: 20,
            idCategory
        };
        const response = await request(app).post(`/api/products`).send(productData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});