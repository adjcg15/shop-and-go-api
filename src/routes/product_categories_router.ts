import { Router } from "express";
import { getProductCategoriesController, updateProductCategoryController } from "../controllers/product_categories_controller";
import { allowRoles, checkTokenValidity, initializeOptionalSession } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { updateProductCategoryValidationSchema } from "../validation_schemas/product_categories";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";

const router = Router();

router.get(
    "/",
    initializeOptionalSession([UserRoles.ADMINISTRATOR]),
    getProductCategoriesController
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