import { Router } from "express";
import { checkSchema } from "express-validator";
import { getProductsInStoreController, getStoreInventoriesController, getStoresController } from "../controllers/stores_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { getProductsInStoreValidationSchema, getStoreInventoriesValidationSchema } from "../validation_schemas/products";
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
    "/:idStore/inventories",
    checkSchema(getStoreInventoriesValidationSchema),
    validateRequestSchemaMiddleware,
    getStoreInventoriesController
);

router.get(
    "/",
    getStoresController
);

export default router;