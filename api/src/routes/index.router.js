import { Router } from "express";
const router = Router();
import user from "./user.router.js";

//importacion de las rutas al index
router.use(user);

//exportacion de la ruta central
export default router;
