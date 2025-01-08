import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCodes } from "../types/enums/http";

function validateRequestSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            details: errors.array().map(error => error.msg)
        });
    } else {
        next();
    }
}

export default validateRequestSchemaMiddleware;