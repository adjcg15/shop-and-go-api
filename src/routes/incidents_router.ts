import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { createIncidentController, getIncidentsListController } from "../controllers/incidents_controller";
import { createIncidentValidationSchema, getIncidentsListValidationSchema } from "../validation_schemas/incidents";
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

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.DELIVERY_MAN]),
    checkSchema(createIncidentValidationSchema),
    validateRequestSchemaMiddleware,
    createIncidentController
);

export default router;