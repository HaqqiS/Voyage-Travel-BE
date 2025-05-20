import { Request, Response } from "express";
import UserModel, { userDTO, userLoginDTO } from "../models/user.model";
import response from "../utils/response";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { GoogleUserInfo, IReqUser } from "../utils/interfaces";
import { getGoogleAuthURL, getGoogleUserInfo } from "../utils/googleAuth";
import { getId } from "../utils/id";
import { FRONTEND_URL } from "../utils/environment";

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

    async googleAuthUrl(req: Request, res: Response) {
        try {
            const url = getGoogleAuthURL();
            response.success(res, { url }, "Google auth URL generated successfully");
        } catch (error) {
            response.error(res, error, "Failed to generate Google auth URL");
        }
    },

    async googleCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;

            if (!code || typeof code !== "string") {
                response.error(res, null, "Authorization code is missing");
            }

            const googleUser = (await getGoogleUserInfo(code as string)) as GoogleUserInfo;

            if (!googleUser.email || !googleUser.id) {
                response.error(res, null, "Failed to get user info from Google");
            }

            if (!googleUser.verified_email) {
                response.error(res, null, "Google email is not verified");
            }

            // Cek apakah user dengan googleId ini sudah ada
            let user = await UserModel.findOne({ googleId: googleUser.id });

            if (!user) {
                // Cek apakah user dengan email ini sudah ada
                user = await UserModel.findOne({ email: googleUser.email });

                if (user) {
                    // Link Google account ke user yang sudah ada
                    user.googleId = googleUser.id;
                    if (googleUser.picture) {
                        user.profilePicture = googleUser.picture;
                    }
                    await user.save();
                } else {
                    // Buat user baru
                    const randomUsername = await getId("user", 8);
                    const randomPassword = await getId("password", 12);

                    user = await UserModel.create({
                        fullname: googleUser.name || "Google User",
                        username: randomUsername,
                        email: googleUser.email,
                        password: randomPassword, // Akan dienkripsi oleh pre-save middleware
                        googleId: googleUser.id,
                        profilePicture: googleUser.picture || "user.jpg",
                    });
                }
            }

            // Generate token
            const token = generateToken({
                id: user._id,
                role: user.role,
            });

            // Redirect ke frontend dengan token atau kirim JSON
            // response.success(res, { token, user }, "Google authentication successful");
            res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}`);
        } catch (error) {
            // console.error("Google auth error:", error);
            response.error(res, error, "Authentication failed");
        }
    },
};
