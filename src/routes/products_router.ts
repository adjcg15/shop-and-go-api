import { Router } from "express";
import { injectDefaultGetProductsQueryMiddleware } from "../middlewares/value_injectors";
import { getAllProductsController, getProductInventoriesByIdProductController } from "../controllers/products_controller";
import { checkSchema } from "express-validator";
import { getAllProductsValidationSchema, getProductInventoriesValidationSchema } from "../validation_schemas/products";

const router = Router();

router.get(
    "/",
    checkSchema(getAllProductsValidationSchema),
    injectDefaultGetProductsQueryMiddleware,
    getAllProductsController
);

router.get(
    "/:idProduct/inventory",
    checkSchema(getProductInventoriesValidationSchema),
    getProductInventoriesByIdProductController
);

export default router;