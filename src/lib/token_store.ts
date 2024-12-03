import { IJWTPayload } from "../types/interfaces/jwt";
import { SignOptions, sign, verify } from "jsonwebtoken";

class TokenStore {
    private static readonly TOKEN_EXPIRATION = 60 * 20;
    private privateKey: string;

    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable not defined");
        }
        this.privateKey = process.env.JWT_SECRET;
    }

    public sign(user: IJWTPayload): string {
        const signOptions: SignOptions = {
            expiresIn: TokenStore.TOKEN_EXPIRATION
        }

        return sign(user, this.privateKey, signOptions);
    }

    public verify(token: string): IJWTPayload | undefined {
        try {
            return verify(token, this.privateKey) as IJWTPayload;
        } catch (error) {
            return undefined;
        }
    }
}

export default TokenStore;