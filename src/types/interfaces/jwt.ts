import { JwtPayload } from "jsonwebtoken";
import UserRoles from "../enums/user_roles";

interface IJWTPayload extends JwtPayload {
    id: number;
    userRole: UserRoles;
};

declare module "express-serve-static-core" {
    interface Request {
      user: IJWTPayload;
    }
}

export {
    IJWTPayload
};