import { Router } from "express";
import { checkTokenValidity, validateClientOwnership } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { createOrderValidationsSchema } from "../validation_schemas/orders";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createOrderController, getOrdersToDeliverController } from "../controllers/orders_controller";

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


export default router;