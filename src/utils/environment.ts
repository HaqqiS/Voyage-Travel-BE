import dotenv from "dotenv";

dotenv.config();

export const PORT: number | string = process.env.PORT || 3000;

export const SECRET: string = process.env.SECRET || "";

export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";

export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "";

export const GOOGLE_REDIRECT_URL: string = process.env.GOOGLE_REDIRECT_URL || "";

export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";

export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";
