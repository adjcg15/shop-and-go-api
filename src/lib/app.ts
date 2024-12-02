import express from "express";
import cors from "cors";
import storesRouter from "../routes/stores_router";
import handleApiErrorMiddleware from "../middlewares/error_handler";

export default function createApp() {
    const app = express();

    app.use(cors({
        origin: process.env.CLIENT_APPLICATION_HOST,
        optionsSuccessStatus: 200
    }));

    app.use(express.json());

    app.use("/api/stores", storesRouter);

    app.use(handleApiErrorMiddleware);

    return app;
}