import jwt, { type SignOptions } from "jsonwebtoken";
import argon2 from "argon2";
import type { User } from "@repo/types";
import config from "../config";

// Create Access JWT token
export const createToken = (user: User, secret: string) => {
    const options: SignOptions = {
        expiresIn: config.cookies.accessTokenExpire,
    };
    
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
    }, secret, options);
};

// Verify Access JWT token
export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};

export const hashString = async (str: string) => {
    return await argon2.hash(str, {
        type: argon2.argon2id,
        timeCost: 2,
    });
};

export const verifyString = async (str: string, hash: string) => {
    return await argon2.verify(hash, str);
};
