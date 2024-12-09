import { Router } from "express";
import { getProductCategoriesController } from "../controllers/product_categories_controller";

const router = Router();

router.get(
    "/",
    getProductCategoriesController
);

export default router;