import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import loginSchema from "../validation_schemas/session";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { sessionController } from "../controllers/session_controller";

const router = Router();

router.post(
    "/",
    limitPublicEndpointUse(),
    checkSchema(loginSchema),
    validateRequestSchemaMiddleware,
    sessionController
);

export default router;