import { Router } from "express";
import { checkTokenValidity } from "../middlewares/access_control";
import { allowRoles } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";

const router = Router();

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.CLIENT])
);

export default router;