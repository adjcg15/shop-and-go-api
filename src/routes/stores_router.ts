import { Router } from "express";
import { checkSchema } from "express-validator";
import {
    getNearestStoreController,
    getProductsInStoreController,
    getProductWithStockInStoreController,
    getStoreInventoriesController,
    getStoresController,
} from "../controllers/stores_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import {
    getProductsInStoreValidationSchema,
    getProductWithStockInStoreValidationSchema,
    getStoreInventoriesValidationSchema,
} from "../validation_schemas/products";
import { injectDefaultGetProductsInStoreQueryMiddleware } from "../middlewares/value_injectors";
import { getNearestStoreValidationSchema } from "../validation_schemas/addresses";
import UserRoles from "../types/enums/user_roles";
import { initializeOptionalSession } from "../middlewares/access_control";

const router = Router();

router.get(
    "/:idStore/products",
    initializeOptionalSession([UserRoles.SALES_EXECUTIVE]),
    checkSchema(getProductsInStoreValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetProductsInStoreQueryMiddleware,
    getProductsInStoreController
);

router.get(
    "/:idStore/products/:barCode",
    checkSchema(getProductWithStockInStoreValidationSchema),
    validateRequestSchemaMiddleware,
    getProductWithStockInStoreController
);

router.get(
    "/:idStore/inventories",
    checkSchema(getStoreInventoriesValidationSchema),
    validateRequestSchemaMiddleware,
    getStoreInventoriesController
);

router.get("/", getStoresController);

router.post(
    "/nearest-store",
    checkSchema(getNearestStoreValidationSchema),
    validateRequestSchemaMiddleware,
    getNearestStoreController
);

export default router;
