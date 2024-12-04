import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IErrorMessageWithCode } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import TrustedException from "../exceptions/TrustedException";
import logger from "../lib/logger";

function handleApiErrorMiddleware(error: any, req: Request, res: Response<IErrorMessageWithCode>, next: NextFunction) {
    const response: IErrorMessageWithCode = {
        details: "It was not possible to process your request, please try it again later"
    };
    
    let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;

    if(error instanceof BusinessLogicException) {
        statusCode = HttpStatusCodes.BAD_REQUEST;
        response.details = error.message;
        response.errorCode = error.errorCode;

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