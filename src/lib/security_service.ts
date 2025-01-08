import bcrypt from "bcrypt";
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

function hashString(plainPassword: string) {
    const SALT_ROUNDS = 10;

    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);
    
    return hashedPassword;
}

async function compareHashedString(plainPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
}

function encryptCardNumber(cardNumber: string) {
    if (!process.env.ENCRYPTATION_KEY) {
        throw new Error("ENCRYPTATION_KEY environment variable not defined");
    }
    const key = process.env.ENCRYPTATION_KEY;
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { encryptedCardNumber: encrypted, initialVector: iv.toString('hex') , authenticationTag: cipher.getAuthTag().toString('hex') };
}

function decryptCardNumber(encryptedData: string, initialVector: Buffer, authenticationTag: Buffer) {
    if (!process.env.ENCRYPTATION_KEY) {
        throw new Error("ENCRYPTATION_KEY environment variable not defined");
    }
    const key = process.env.ENCRYPTATION_KEY;
    const decipher = createDecipheriv('aes-256-gcm', key, initialVector);
    decipher.setAuthTag(authenticationTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

export {
    hashString,
    compareHashedString,
    encryptCardNumber,
    decryptCardNumber
}