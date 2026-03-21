import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/message", authUser, sendMessage);
chatRouter.get("/", authUser, getChats);
chatRouter.get("/:chatId/messages", authUser, getMessages);
chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
