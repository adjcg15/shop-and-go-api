import { Router } from "express";
import { getIssuingBanksController } from "../controllers/issuing_banks_controller";

const router = Router();

router.get(
    "/",
    getIssuingBanksController
);

export default router;