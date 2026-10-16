import express  from "express";

import cors     from "cors";

import ProvinceRouter from "./src/controllers/province-controller.js"

import swaggerUi from "swagger-ui-express";

import swaggerFile from "./swagger-output.json" with { type: "json" };


const app  = express();

const port = 3000;       // El puerto 3000 (http://localhost:3000)


// Agrego los Middlewares

app.use(cors());         // Middleware de CORS.

app.use(express.json()); // Middleware para parsear y comprender JSON.


//

// Endpoints (todos los Routers)

//

app.use("/api/province", ProvinceRouter);


//

// Inicio el Server y lo pongo a escuchar.

//
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)

})