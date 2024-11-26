import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import handleApiError from "./middlewares/error_handler";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_APPLICATION_HOST,
    optionsSuccessStatus: 200
}));
app.use(express.json());

app.use(handleApiError);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});