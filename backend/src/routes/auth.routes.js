import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerifyEmail,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validation/auth.js";
import { authUser } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// POST /auth/register
// validation runs first; controller runs only if request passes
authRouter.post("/register", validateRegister, registerUser);
authRouter.post("/resend-verification", resendVerifyEmail);
authRouter.post("/login", validateLogin, loginUser);
authRouter.post("/logout", authUser, logoutUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.get("/getme", authUser, getUser);

export default authRouter;
