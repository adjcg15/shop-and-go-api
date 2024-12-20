import express from "express";
import cors from "cors";
import storesRouter from "../routes/stores_router";
import clientsRouter from "../routes/clients_router";
import sessionRouter from "../routes/sessions_router";
import productCategoriesRouter from "../routes/product_categories_router";
import productsRouter from "../routes/products_router"
import orderRouter from "../routes/orders_router"
import issuingBanksRouter from "../routes/issuing_banks_router";
import handleApiErrorMiddleware from "../middlewares/error_handler";

export default function createApp() {
    const app = express();

    app.use(cors({
        origin: process.env.CLIENT_APPLICATION_HOST,
        optionsSuccessStatus: 200
    }));

    app.use(express.json());

    app.use("/api/stores", storesRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/clients", clientsRouter);
    app.use("/api/product-categories", productCategoriesRouter);
    app.use("/api/issuing-banks", issuingBanksRouter);
    app.use("/api/sessions", sessionRouter);

    app.use(handleApiErrorMiddleware);

    return app;
}