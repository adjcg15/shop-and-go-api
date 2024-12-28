import { Router } from "express";
import { getProductCategoriesController } from "../controllers/product_categories_controller";
import { initializeOptionalSession } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";

const router = Router();

router.get(
    "/",
    initializeOptionalSession([UserRoles.ADMINISTRATOR]),
    getProductCategoriesController
);

export default router;