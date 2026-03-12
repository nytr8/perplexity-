import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// built-in middleware for parsing JSON bodies
app.use(express.json());
app.use(cookieParser());

// authentication endpoints
app.use("/api/auth", authRouter);

export default app;
