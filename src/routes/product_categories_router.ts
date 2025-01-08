import { Router } from "express";
import { createProductCategoryController, getProductCategoriesController, updateProductCategoryController } from "../controllers/product_categories_controller";
import { allowRoles, checkTokenValidity, initializeOptionalSession } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { createProductCategoryValidationSchema, updateProductCategoryValidationSchema } from "../validation_schemas/product_categories";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";

const router = Router();

router.get(
    "/",
    initializeOptionalSession([UserRoles.ADMINISTRATOR]),
    getProductCategoriesController
);

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(createProductCategoryValidationSchema),
    validateRequestSchemaMiddleware,
    createProductCategoryController
);

router.patch(
    "/:idCategory",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(updateProductCategoryValidationSchema),
    validateRequestSchemaMiddleware,
    updateProductCategoryController
);

export default router;