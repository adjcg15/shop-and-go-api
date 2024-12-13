import { Router } from "express";
import { checkTokenValidity } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { createOrderValidationsSchema } from "../validation_schemas/orders";

const router = Router();

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.CLIENT]),
    checkSchema(createOrderValidationsSchema),
);

export default router;