import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validateRegister } from "../validation/auth.js";

const authRouter = express.Router();

// POST /auth/register
// validation runs first; controller runs only if request passes
authRouter.post("/register", validateRegister, registerUser);

export default authRouter;
