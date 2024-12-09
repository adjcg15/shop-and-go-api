import { Router } from "express";
import { injectDefaultGetProductsQueryMiddleware } from "../middlewares/value_injectors";
import { getAllProductsController } from "../controllers/products_controller";

const router = Router();

router.get(
    "/",
    injectDefaultGetProductsQueryMiddleware,
    getAllProductsController
);

export default router;