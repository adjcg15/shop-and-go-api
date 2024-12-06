import { Router } from "express";
import { checkTokenValidity } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import { checkSchema } from "express-validator";
import { addPaymentMethodToClientController, deletePaymentMethodFromClientController } from "../controllers/client_controller";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { addPaymentMethodToClientSchema, deletePaymentMethodFromClientSchema, getPaymentMethodsFromClientSchema } from "../validation_schemas/payments_methods";
import UserRoles from "../types/enums/user_roles";

const router = Router();

router.post(
    "/:idClient/payment-methods",
    //checkTokenValidity,
    //allowRoles(UserRoles.CLIENT),
    checkSchema(addPaymentMethodToClientSchema),
    validateRequestSchemaMiddleware,
    addPaymentMethodToClientController
);

router.delete(
    "/:idClient/payment-methods/:idPaymentMethod",
    //checkTokenValidity,
    //allowRoles(UserRoles.CLIENT),
    checkSchema(deletePaymentMethodFromClientSchema),
    validateRequestSchemaMiddleware,
    deletePaymentMethodFromClientController
);

router.get(
    "/:idClient/payment-methods",
    //checkTokenValidity,
    //allowRoles(UserRoles.CLIENT),
    checkSchema(getPaymentMethodsFromClientSchema),
    validateRequestSchemaMiddleware,
    
);

export default router;