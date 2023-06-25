import express from "express";
import morgan from "morgan";
import router from "./src/routes/index.router.js";

//configuaracion express
const app = express();

//midelwares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//rutas
app.use("/api", router);

export default app;
