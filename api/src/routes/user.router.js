import { Router } from "express";
import {
  addUser,
  deleteUser,
  loginUser,
  codeEmail,
  updateUser,
  veryficateCode,
} from "../controllers/user.controller.js";
import { ensureAuth } from "../middlewares/authenticated.js";
const router = Router();

router.post("/SignUp", addUser);
router.post("/LogIn", loginUser);
router.put("/updateUser/:id", ensureAuth, updateUser);
router.delete("/deleteUser/:id", ensureAuth, deleteUser);
router.post("/codeEmail", codeEmail);
router.post("/veryficateCode", veryficateCode);

export default router;
