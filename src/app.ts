import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PORT } from "./utils/environment";
import db from "./utils/database";
import router from "./routes/api";
import response from "./utils/response";
import errorMiddleware from "./middlewares/error.middleware";
import docs from "./docs/route";

const app = express();

async function main() {
    try {
        const result = await db();
        console.log("Database connection: ", result);

        app.use(cors());
        app.use(bodyParser.json());

        app.get("/", (req, res) => {
            response.success(res, null, "Welcome to the API");
        });

        app.use("/api", router);
        // Setup Swagger documentation
        docs(app);

        app.use(errorMiddleware.serverRoute());
        app.use(errorMiddleware.serverError());

        // Only start the server if we're not in production (not on Vercel)
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }

        return app;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Run main() in development
if (process.env.NODE_ENV !== 'production') {
    main().catch(console.error);
}

// Export both the app and main function for Vercel
export default app;
export { main };
