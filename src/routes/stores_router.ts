import { Router } from "express";
import { checkSchema } from "express-validator";
import {
    getNearestStoreController,
    getProductsInStoreController,
    getProductWithStockInStoreController,
    getStoreInventoriesController,
    getStoresController,
    updateStoreController,
} from "../controllers/stores_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import {
    getProductsInStoreValidationSchema,
    getProductWithStockInStoreValidationSchema,
    getStoreInventoriesValidationSchema
} from "../validation_schemas/products";
import { injectDefaultGetProductsInStoreQueryMiddleware } from "../middlewares/value_injectors";
import { getNearestStoreValidationSchema } from "../validation_schemas/addresses";
import UserRoles from "../types/enums/user_roles";
import { allowRoles, checkTokenValidity, initializeOptionalSession } from "../middlewares/access_control";
import { updateStoreValidationSchema } from "../validation_schemas/stores";

const router = Router();

router.put(
    "/:idStore",
    initializeOptionalSession([UserRoles.ADMINISTRATOR]),
    checkSchema(updateStoreValidationSchema),
    validateRequestSchemaMiddleware,
    updateStoreController
);

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

router.get(
    "/", 
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    getStoresController
);

router.post(
    "/nearest-store",
    checkSchema(getNearestStoreValidationSchema),
    validateRequestSchemaMiddleware,
    getNearestStoreController
);

export default router;
