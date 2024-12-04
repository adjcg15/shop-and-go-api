import { IJWTPayload } from "../types/interfaces/jwt";
import { SignOptions, sign, verify } from "jsonwebtoken";

function signToken(user: IJWTPayload): string {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable not defined");
    }
    const privateKey = process.env.JWT_SECRET;
    const TOKEN_EXPIRATION = 60 * 20;
    const signOptions: SignOptions = {
        expiresIn: TOKEN_EXPIRATION
    }

    return sign(user, privateKey, signOptions);
}

function verifyToken(token: string): IJWTPayload | undefined {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable not defined");
    }
    const privateKey = process.env.JWT_SECRET;
    try {
        return verify(token, privateKey) as IJWTPayload;
    } catch (error) {
        return undefined;
    }
}

export { signToken, verifyToken };