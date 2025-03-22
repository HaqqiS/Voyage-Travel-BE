import crypto from "crypto";
import { SECRET } from "./environment";

export const encrypt = (password: string): string => {
    const encrypted = crypto.pbkdf2Sync(password, SECRET, 1000, 64, "sha512").toString("hex");
    return encrypted;
};

// console.log(encrypt("password")); // 0e7f5b7d7e8b1b0b7b2f3b4
