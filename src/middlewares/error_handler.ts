import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import BusinessLogicException from "../exceptions/business/business_logic_exception";
import TrustedException from "../exceptions/trusted_exception";
import logger from "../lib/logger";

function handleApiErrorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    const response = {
        details: "It was not possible to process your request, please try it again later"
    };
    let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;

    if(error instanceof BusinessLogicException) {
        statusCode = HttpStatusCodes.BAD_REQUEST;
        response.details = error.message;

        logger.waring(error.name, error.message);
    } else {
        let errorName = "Unhandled exception";
        if(error instanceof TrustedException) {
            errorName = error.name;
            response.details = error.message;
        }

        logger.error(errorName, error.message);
    }
    
    res.status(statusCode).json(response);
}

export default handleApiErrorMiddleware;