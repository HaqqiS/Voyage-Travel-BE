import { SECRET } from "./environment";
import { IReqUser, IUserToken } from "./interfaces";
import Jwt from "jsonwebtoken";

export const generateToken = (user: IUserToken): string => {
    const token = Jwt.sign(user, SECRET, {
        expiresIn: "1d",
    });
    return token;
};

export const getUserData = (token: string) => {
    const user = Jwt.verify(token, SECRET) as IUserToken;
    return user;
};
