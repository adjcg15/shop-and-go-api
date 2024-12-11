import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EUpdateProductTestData } from "../../../test_data/e2e/products_test_data";
import { UpdateProductErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/products/:idProduct", () => {
    let app: Express;
    let idProduct: number = 1;
    let idStoreXalapa: number = 1;
    let idStoreCarranza: number = 2;
    let idStoreMartinez: number = 3;
    let idCategory: number = 1;
    let idInventoryXalapa: number = 1;
    let idInventoryCarranza: number = 1;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EUpdateProductTestData();
        idProduct = testDataResult.idProduct;
        idStoreXalapa = testDataResult.idStoreXalapa;
        idStoreCarranza = testDataResult.idStoreCarranza;
        idStoreMartinez = testDataResult.idStoreMartinez;
        idCategory = testDataResult.idCategory;
        idInventoryXalapa = testDataResult.idInventoryXalapa;
        idInventoryCarranza = testDataResult.idInventoryCarranza;
    });

    it("Should register the product with inventories in database", async () => {
        const productData = {
            name: "Queso Panela Fud 400 gr",
            description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
            imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
            salePrice: 43.33,
            maximumAmount: 20,
            isActive: true,
            idCategory,
            inventories: [
                {
                    id: idInventoryXalapa,
                    stock: 24, 
                    expirationDate: "2024-12-24"
                },
                {
                    id: idInventoryCarranza,
                    stock: 2, 
                    expirationDate: "2028-12-24"
                },
                {
                    stock: 2, 
                    idStore: idStoreMartinez, 
                    expirationDate: "2028-12-24"
                }
            ]
        };
        const response = await request(app).put(`/api/products/${idProduct}`).send(productData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should register the product without inventories in database", async () => {
        const productData = {
            name: "Queso Panela Fud 400 gr",
            description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
            imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
            salePrice: 43.33,
            maximumAmount: 20,
            isActive: true,
            idCategory
        };
        const response = await request(app).put(`/api/products/${idProduct}`).send(productData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});