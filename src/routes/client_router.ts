import { Router } from "express";
import AccessControl from "../middlewares/access_control";
import { checkSchema } from "express-validator";
import { getProductsInStoreController } from "../controllers/stores_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { addPaymentMethodToClientSchema } from "../validation_schemas/payments_methods";

const router = Router();

router.post(
    "/:idClient/payment-methods",
    //AccessControl.checkTokenValidity,
    checkSchema(addPaymentMethodToClientSchema),
    validateRequestSchemaMiddleware,
    getProductsInStoreController
);

export default router;