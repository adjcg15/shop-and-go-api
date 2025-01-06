import { Router } from "express";
import {
  checkTokenValidity,
  allowRoles,
  validateClientOwnership,
} from "../middlewares/access_control";
import { checkSchema } from "express-validator";
import UserRoles from "../types/enums/user_roles";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { createEmployeeSchema } from "../validation_schemas/employee";
import { createEmployeeController } from "../controllers/employee_controller";

const router = Router();

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(createEmployeeSchema),
    validateRequestSchemaMiddleware,
    createEmployeeController
);

export default router; 