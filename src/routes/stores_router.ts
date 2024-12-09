import { Router } from "express";
import { checkSchema } from "express-validator";
import { getProductsInStoreController, getStoresController } from "../controllers/stores_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { getProductsInStoreValidationSchema } from "../validation_schemas/products";
import { injectDefaultGetProductsInStoreQueryMiddleware } from "../middlewares/value_injectors";

const router = Router();

router.get(
    "/:idStore/products",
    checkSchema(getProductsInStoreValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetProductsInStoreQueryMiddleware,
    getProductsInStoreController
);

router.get(
    "/",
    getStoresController
);

export default router;