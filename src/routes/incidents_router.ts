import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { getIncidentsListController } from "../controllers/incidents_controller";
import { getIncidentsListValidationSchema } from "../validation_schemas/incidents";
import { checkSchema } from "express-validator";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetIncidentsListQueryMiddleware } from "../middlewares/value_injectors";

const router = Router();

router.get(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(getIncidentsListValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetIncidentsListQueryMiddleware,
    getIncidentsListController
);