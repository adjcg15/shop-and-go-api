import { HttpStatusCodes } from "../types/enums/http";
import { NextFunction, Request, Response } from "express";
import { signToken } from "../lib/token_store";
import { ILoginBody } from "../types/interfaces/request_bodies";
import { isEmployeeWithPosition } from "../lib/user_service";
import { IEmployeeWithPosition, IClientWithOptionalPassword} from "../types/interfaces/response_bodies";
import { getUserByPhoneNumber, getUserByUsername} from "../services/users_service";
import { compareHashedString } from "../lib/security_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import { getClientById } from "../services/clients_service";
import { getEmployeeById } from "../services/employees_service";

async function loginController(
    req: Request<{}, {}, ILoginBody, {}>, 
    res: Response<IClientWithOptionalPassword | IEmployeeWithPosition>, 
    next: NextFunction
) {
    try {
        const { phoneNumber, username, password } = req.body;
        
        let user: IClientWithOptionalPassword | IEmployeeWithPosition;
        if(phoneNumber) {
            user = await getUserByPhoneNumber(phoneNumber);
        } else {
            user = await getUserByUsername(username);
        }

        const validateCredentials = await compareHashedString(password!, user.passwordHash!);

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

async function getUserProfileController(
    req: Request, 
    res: Response<IClientWithOptionalPassword | IEmployeeWithPosition>, 
    next: NextFunction
) {
    try {
        const { id, userRole } = req.user;
        let profile: IClientWithOptionalPassword | IEmployeeWithPosition | null;

        if(userRole === UserRoles.CLIENT) {
            profile = await getClientById(id);
        } else {
            profile = await getEmployeeById(id);
        }

        res.status(HttpStatusCodes.OK).json(profile!);
    } catch (error) {
        next(error);
    }
}

export { 
    loginController,
    getUserProfileController
};