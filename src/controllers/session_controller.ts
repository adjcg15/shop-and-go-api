import { HttpStatusCodes } from "../types/enums/http";
import { NextFunction, Request, Response } from "express";
import { signToken, verifyToken } from "../lib/token_store";
import { ILoginBody } from "../types/interfaces/request_bodies";
import { IEmployeeWithPosition, IClientWithOptionalPassword, isEmployeeWithPosition } from "../types/interfaces/response_bodies";
import { getUserByPhoneNumberOrUsername } from "../services/session_service";
import { comparePassword } from "../lib/security_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";

async function sessionController(
    req: Request<{}, {}, ILoginBody, {}>, 
    res: Response<IClientWithOptionalPassword | IEmployeeWithPosition>, 
    next: NextFunction
) {
    try {
        const { phoneNumber, username, password } = req.body;
        
        let user = await getUserByPhoneNumberOrUsername(phoneNumber, username);

        const validateCredentials = comparePassword(password!, user.passwordHash!);

        if (!validateCredentials) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        let token;
        if (isEmployeeWithPosition(user)) {
            token = signToken({
                id: user.id,
                userRole: user.position!
            });
        } else {
            token = signToken({
                id: user.id,
                userRole: UserRoles.CLIENT
            });
        }
        
        delete user.passwordHash;

        res.status(HttpStatusCodes.CREATED)
                .json({
                    token,
                    ...user
                });
    } catch (error) {
        next(error);
    }
}

export { sessionController }