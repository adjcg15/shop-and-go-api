import { signToken, verifyToken } from "../lib/token_store";
import { HttpStatusCodes } from "../types/enums/http";
import UserRoles from "../types/enums/user_roles";
import { NextFunction, Request, Response } from "express";

function checkTokenValidity(req: Request, res: Response, next: NextFunction): void {
    const TOKEN_RENEWAL_LIMIT = 60 * 5;
    const authorizationHeader = String(req.headers.authorization);
    if(!authorizationHeader.startsWith("Bearer ")) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    const token = authorizationHeader.split(' ')[1];
    const payload = verifyToken(token); 

    if(!payload) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    const tokenValiditySeconds = (payload.exp ?? 0) - (new Date().getTime() / 1000);
    if(tokenValiditySeconds < TOKEN_RENEWAL_LIMIT) {
        const { id, userRole } = payload;
        const newToken = signToken({ id, userRole });

        res.header("Set-Authorization", newToken);
    }

    req.user = payload;
    next();
}

function allowRoles(allowedRoles: UserRoles) {
    return function(req: Request, res: Response, next: NextFunction) {
        const { userRole } = req.user;

        if(allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(HttpStatusCodes.FORBIDDEN).send();
        }
    }
}

export { checkTokenValidity, allowRoles };