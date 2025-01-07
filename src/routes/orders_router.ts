import { Router } from "express";
import { checkTokenValidity, validateClientOwnership } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { createOrderValidationsSchema, deliverOrderValidationsSchema, getOrderToAssignByIdValidationSchema } from "../validation_schemas/orders";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createOrderController, deliverOrderController, getOrdersToAssignController, getOrdersToDeliverController, getOrderToAssignByIdController } from "../controllers/orders_controller";

const router = Router();

router.post(
    "/",
    checkTokenValidity,
    validateClientOwnership,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(createOrderValidationsSchema),
    validateRequestSchemaMiddleware,
    createOrderController
);

router.get(
    "/orders-to-deliver",
    checkTokenValidity,
    allowRoles([UserRoles.DELIVERY_MAN]),
    getOrdersToDeliverController
);

router.get(
    "/orders-to-assign",
    checkTokenValidity,
    allowRoles([UserRoles.SALES_EXECUTIVE]),
    getOrdersToAssignController
);

router.get(
    "/orders-to-assign/:idOrder",
    checkTokenValidity,
    allowRoles([UserRoles.SALES_EXECUTIVE]),
    checkSchema(getOrderToAssignByIdValidationSchema),
    validateRequestSchemaMiddleware,
    getOrderToAssignByIdController
);

router.post(
    "/deliveries",
    checkTokenValidity,
    allowRoles([UserRoles.DELIVERY_MAN]),
    checkSchema(deliverOrderValidationsSchema),
    validateRequestSchemaMiddleware,
    deliverOrderController
);


export default router;