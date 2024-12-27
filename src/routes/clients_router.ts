import { Router } from "express";
import { checkTokenValidity, allowRoles, validateClientOwnership } from "../middlewares/access_control";
import { checkSchema } from "express-validator";
import { createClientController,createAddressToClientController, createPaymentMethodToClientController, deletePaymentMethodFromClientController, getAddressesFromClientController, getPaymentMethodsFromClientController } from "../controllers/client_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createPaymentMethodToClientValidationSchema, deletePaymentMethodFromClientValidationSchema, getPaymentMethodsFromClientValidationSchema } from "../validation_schemas/payments_methods";
import UserRoles from "../types/enums/user_roles";
import { createAddressToClientValidationSchema, getAddressesFromClientValidationSchema } from "../validation_schemas/addresses";
import { createClientSchema } from "../validation_schemas/clients";

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

router.get(
    "/:idClient/addresses",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(getAddressesFromClientValidationSchema),
    validateRequestSchemaMiddleware,
    getAddressesFromClientController
)
router.post(
    "/",
    checkSchema(createClientSchema),
    validateRequestSchemaMiddleware,
    createClientController
);

router.post(
    "/:idClient/addresses",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(createAddressToClientValidationSchema),
    validateRequestSchemaMiddleware,
    createAddressToClientController
)

export default router;