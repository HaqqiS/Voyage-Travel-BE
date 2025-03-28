import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./utils/database";
import { PORT } from "./utils/environment";
import router from "./routes/api";
import response from "./utils/response";
import errorMiddleware from "./middlewares/error.middleware";
import docs from "./docs/route";

db()
    .then((result) => console.log("Database connection: ", result))
    .catch((error) => console.log("Database connection error: ", error));

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = PORT;

app.get("/", (req, res) => {
    response.success(res, null, "Welcome to the API");
});

app.use("/api", router);
// Setup Swagger documentation
docs(app);

app.use(errorMiddleware.serverRoute());
app.use(errorMiddleware.serverError());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
