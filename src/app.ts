import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import handleApiErrorMiddleware from "./middlewares/error_handler";
import storesRouter from "./routes/stores_router";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_APPLICATION_HOST,
    optionsSuccessStatus: 200
}));

app.use(express.json());

app.use("/stores", storesRouter);

app.use(handleApiErrorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});