import { Router } from "express";
import { checkTokenValidity, allowRoles, validateClientOwnership } from "../middlewares/access_control";
import { checkSchema } from "express-validator";
import { createPaymentMethodToClientController, deletePaymentMethodFromClientController, getPaymentMethodsFromClientController } from "../controllers/client_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createPaymentMethodToClientValidationSchema, deletePaymentMethodFromClientValidationSchema, getPaymentMethodsFromClientValidationSchema } from "../validation_schemas/payments_methods";
import UserRoles from "../types/enums/user_roles";

const router = Router();

router.post(
    "/:idClient/payment-methods",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(createPaymentMethodToClientValidationSchema),
    validateRequestSchemaMiddleware,
    createPaymentMethodToClientController
);

router.delete(
    "/:idClient/payment-methods/:idPaymentMethod",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(deletePaymentMethodFromClientValidationSchema),
    validateRequestSchemaMiddleware,
    deletePaymentMethodFromClientController
);

router.get(
    "/:idClient/payment-methods",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(getPaymentMethodsFromClientValidationSchema),
    validateRequestSchemaMiddleware,
    getPaymentMethodsFromClientController
);

export default router;