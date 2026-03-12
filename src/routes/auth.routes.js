import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validation/auth.js";
import { authUser } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// POST /auth/register
// validation runs first; controller runs only if request passes
authRouter.post("/register", validateRegister, registerUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.get("/login", validateLogin, loginUser);
authRouter.get("/getme", authUser, getUser);

export default authRouter;
