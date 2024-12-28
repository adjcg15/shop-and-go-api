import { IJWTPayload } from "../types/interfaces/jwt";
import { SignOptions, decode, sign, verify } from "jsonwebtoken";

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

function decodeToken(token: string): IJWTPayload | undefined {
    try {
        return decode(token) as IJWTPayload;
    } catch (error) {
        return undefined;
    }
}

const isValidAuthHeader = (header: string) => header.startsWith("Bearer ");

const getToken = (authorizationHeader: string) => authorizationHeader.split(' ')[1];

function isTokenAboutToExpire(tokenPayload: IJWTPayload) {
    const TOKEN_RENEWAL_LIMIT = 60 * 5;
    const tokenValiditySeconds = (tokenPayload.exp ?? 0) - (new Date().getTime() / 1000);
    return tokenValiditySeconds < TOKEN_RENEWAL_LIMIT;
};

export { 
    signToken, 
    verifyToken,
    isValidAuthHeader,
    getToken,
    isTokenAboutToExpire,
    decodeToken
};