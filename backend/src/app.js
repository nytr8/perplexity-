import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";
const app = express();

// built-in middleware for parsing JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://perplexity-ashy-chi.vercel.app",
    credentials: true,
  }),
);
app.use(morgan("dev"));

// authentication endpoints
app.use("/api/auth", authRouter);
// chat endpoints
app.use("/api/chats", chatRouter);

export default app;
