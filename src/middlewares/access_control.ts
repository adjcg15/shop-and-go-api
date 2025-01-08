import { decodeToken, getToken, isTokenAboutToExpire, isValidAuthHeader, signToken, verifyToken } from "../lib/token_store";
import { HttpStatusCodes } from "../types/enums/http";
import UserRoles from "../types/enums/user_roles";
import { NextFunction, Request, Response } from "express";

function checkTokenValidity(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = String(req.headers.authorization);
    if(!isValidAuthHeader(authorizationHeader)) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    const token = getToken(authorizationHeader);
    const payload = verifyToken(token); 

    if(!payload) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    if(isTokenAboutToExpire(payload)) {
        const { id, userRole } = payload;
        const newToken = signToken({ id, userRole });

        res.header("Set-Authorization", newToken);
    }

    req.user = payload;
    next();
}

function initializeOptionalSession(rolesToCheck: UserRoles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authorizationHeader = String(req.headers.authorization);
        
        if(isValidAuthHeader(authorizationHeader)) {
            const token = getToken(authorizationHeader);
            const tokenInfo = decodeToken(token);
    
            if(tokenInfo && rolesToCheck.includes(tokenInfo.userRole)) {
                const payload = verifyToken(token); 

                if(!payload) {
                    res.status(HttpStatusCodes.UNAUTHORIZED).send();
                    return;
                }

                if(isTokenAboutToExpire(payload)) {
                    const { id, userRole } = payload;
                    const newToken = signToken({ id, userRole });
            
                    res.header("Set-Authorization", newToken);
                }

                req.user = payload;
            }
        }
    
        next();
    }
}

function allowRoles(allowedRoles: UserRoles[]) {
    return function(req: Request, res: Response, next: NextFunction) {
        const { userRole } = req.user;

        if(allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(HttpStatusCodes.FORBIDDEN).send();
        }
    }
}

function validateClientOwnership(req: Request, res: Response, next: NextFunction): void {
    const idClient = parseInt(req.params.idClient ? req.params.idClient : req.body.idClient, 10);
    const idUser = req.user.id;

    if (idClient !== idUser) {
        res.status(HttpStatusCodes.FORBIDDEN).send();
    } else {
        next();
    }
}

export { 
    checkTokenValidity, 
    allowRoles,
    validateClientOwnership,
    initializeOptionalSession 
};