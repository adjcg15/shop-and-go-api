import { Router } from "express";
import { checkTokenValidity } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import { injectDefaultGetProductsQueryMiddleware } from "../middlewares/value_injectors";
import { createProductWithInventoriesController, getAllProductsController, getProductInventoriesByIdProductController, updateProductWithInventoriesController } from "../controllers/products_controller";
import { checkSchema } from "express-validator";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createProductWithInventoriesValidationsSchema, getAllProductsValidationSchema, getProductInventoriesValidationSchema, updateProductWithInventoriesValidationsSchema } from "../validation_schemas/products";
import UserRoles from "../types/enums/user_roles";

const router = Router();

router.get(
    "/",
    checkSchema(getAllProductsValidationSchema),
    injectDefaultGetProductsQueryMiddleware,
    getAllProductsController
);

router.post(
    "/",
    //checkTokenValidity,
    //allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(createProductWithInventoriesValidationsSchema),
    validateRequestSchemaMiddleware,
    createProductWithInventoriesController
);

router.put(
    "/",
    //checkTokenValidity,
    //allowRoles([UserRoles.ADMINISTRATOR, UserRoles.SALES_EXECUTIVE]),
    checkSchema(updateProductWithInventoriesValidationsSchema),
    validateRequestSchemaMiddleware,
    updateProductWithInventoriesController
);

router.get(
    "/:idProduct/inventories",
    checkSchema(getProductInventoriesValidationSchema),
    getProductInventoriesByIdProductController
);

export default router;