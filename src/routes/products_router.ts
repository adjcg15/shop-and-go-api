import { Router } from "express";
import { checkSchema } from "express-validator";
import { getProducts } from "../controllers/products";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { getProductsValidationSchema } from "../validation_schemas/products";

const router = Router();

router.get(
    "/",
    checkSchema(getProductsValidationSchema),
    validateRequestSchemaMiddleware, 
    getProducts
);

export default router;