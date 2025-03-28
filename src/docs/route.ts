// import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
// import fs from "fs";
import path from "path";
import express from "express";


// export default function docs(app: Express) {
//     //code yg berhasil
//     const css = fs.readFileSync(
//         path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"),
//         "utf-8",
//     );

//     app.use(
//         "/api-docs",
//         swaggerUi.serve,
//         swaggerUi.setup(swaggerOutput, {
//             customCss: css,
//         }),
//     );
// }

export default function docs(app: express.Express) {
    app.use(
        "/api-docs",
        express.static(path.join(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"))
    );

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerOutput)
    );
}