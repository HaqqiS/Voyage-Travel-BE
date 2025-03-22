import mongoose from "mongoose";
import * as Yup from "yup";
import { ROLES } from "../utils/constant";
import { encrypt } from "../utils/encryption";

const Schema = mongoose.Schema;

export const USERS_MODEL_NAME = "Users";

const validatePassword = Yup.string()
    .required()
    .min(8)
    .test("at-least contain one uppercase", "Password must contain at least one uppercase", (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
    })
    .test("at-least contain one number", "Password must contain at least one number", (value) => {
        if (!value) return false;
        const regex = /^(?=.*[0-9])/;
        return regex.test(value);
    });
const validateConfirmPassword = Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords must match");

export const userLoginDTO = Yup.object({
    identifier: Yup.string().required(),
    password: validatePassword,
});

export const userDTO = Yup.object({
    fullname: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
});

export type TypeUser = Yup.InferType<typeof userDTO>;

export interface User extends Omit<TypeUser, "confirmPassword"> {
    role: string;
    profilePicture: string;
    createdAt?: string;
}

const UserSchema = new Schema<User>(
    {
        fullname: {
            type: Schema.Types.String,
            required: true,
        },
        username: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
        },
        role: {
            type: Schema.Types.String,
            enum: [ROLES.USER, ROLES.ADMIN, ROLES.EXECUTIVE],
            default: ROLES.USER,
        },
        profilePicture: {
            type: Schema.Types.String,
            default: "user.jpg",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);

    next();
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model(USERS_MODEL_NAME, UserSchema);
export default UserModel;
