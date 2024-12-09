import { InferAttributes } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getIssuingBanks } from "../services/issuing_banks_service";
import Issuer from "../models/Issuer";

async function getIssuingBanksController(req: Request, res: Response<InferAttributes<Issuer>[]>, next: NextFunction) {
    try {
        const issuingBanks = await getIssuingBanks();
        res.status(HttpStatusCodes.OK).json(issuingBanks);
    } catch (error) {
        next(error);
    }
}

export {
    getIssuingBanksController
}