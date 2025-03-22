import { NextFunction, Request, Response } from "express";
import UserModel, { userDTO, userLoginDTO } from "../models/user.model";
import response from "../utils/response";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import { google } from "googleapis";
import oauth2Client from "../utils/googleAuth";

export default {
    async register(req: Request, res: Response) {
        const { fullname, username, email, password, confirmPassword } = req.body;
        try {
            await userDTO.validate({ fullname, username, email, password, confirmPassword });
            const result = await UserModel.create({ fullname, username, email, password });

            response.success(res, result, "User has been created successfully");
        } catch (error) {
            response.error(res, error, "Failed to create user");
        }
    },

    async login(req: Request, res: Response) {
        const { identifier, password } = req.body;
        try {
            await userLoginDTO.validate({ identifier, password });

            const userByIdentifier = await UserModel.findOne({
                $or: [{ username: identifier }, { email: identifier }],
            });

            if (!userByIdentifier) {
                return response.unauthorized(res, "User not found");
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return response.unauthorized(res, "user not found");
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            response.success(res, token, "User has been logged in successfully");
        } catch (error) {
            response.error(res, error, "Invalid login details");
        }
    },

    async me(req: IReqUser, res: Response) {
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            response.success(res, result, "User details has been retrieved successfully");
        } catch (error) {
            response.error(res, error, "Failed to get user details");
        }
    },

    async googleLogin(req: Request, res: Response) {
        res.redirect(
            oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
                include_granted_scopes: true,
            })
        );
    },

    async googleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.query;
            // if (!code) {
            //     return response.error(res, "Invalid Request", "No code provided");
            // }
            const { tokens } = await oauth2Client.getToken(code as string);
            oauth2Client.setCredentials(tokens);
            const oauth2 = google.oauth2({
                auth: oauth2Client,
                version: "v2",
            });
            const { data } = await oauth2.userinfo.get();
            // if (!data || !data.email) {
            //     return response.error(res, "Google login failed", "No user data retrieved");
            // }
            let user = await UserModel.findOne({ email: data.email });
            if (!user) {
                user = await UserModel.create({
                    email: data.email,
                    fullname: data.name,
                    profilePicture: data.picture,
                });
            }
            const token = generateToken({
                id: user._id,
                role: user.role,
            });
            response.success(res, { token, user }, "User logged in successfully");
        } catch (error) {
            response.error(res, error, "Authentication error");
        }
    },
};
