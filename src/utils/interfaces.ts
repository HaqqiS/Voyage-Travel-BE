import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface IUserToken
    extends Omit<User, "fullname" | "username" | "email" | "password" | "profilePicture"> {
    id?: Types.ObjectId;
}

export interface IReqUser extends Request {
    user?: IUserToken;
}

export interface IPaginationQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
}
