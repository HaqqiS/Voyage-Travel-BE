import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const SECRET = process.env.SECRET || "";

export const DATABASE_URL = process.env.DATABASE_URL || "";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
