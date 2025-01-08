import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import loginSchema from "../validation_schemas/session";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { loginController, getUserProfileController } from "../controllers/sessions_controller";
import { checkTokenValidity } from "../middlewares/access_control";

const router = Router();

router.post(
    "/",
    limitPublicEndpointUse(),
    checkSchema(loginSchema),
    validateRequestSchemaMiddleware,
    loginController
);

router.get(
    "/profile",
    checkTokenValidity,
    getUserProfileController
);

export default router;