import mongoose from "mongoose";
import { DATABASE_URL } from "./environment";

const connect = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "db-voyage-travel",
        });
        return Promise.resolve("Connected to database");
    } catch (error) {
        return Promise.reject(error);
    }
};

export default connect;
