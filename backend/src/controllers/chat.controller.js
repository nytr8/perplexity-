import chatModel from "../models/chat.js";
import { generateResponse, generateTitle } from "../services/ai.service.js";
import messageModel from "../models/message.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null,
    title = null;

  if (!chatId) {
    title = await generateTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title: title,
    });
  }
  const currentChatId = chatId || chat._id;

  const userMessage = await messageModel.create({
    chat: currentChatId,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: currentChatId });
  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: currentChatId,
    content: result,
    role: "ai",
  });
  res.status(201).json({
    title,
    chat,
    userMessage,
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(200).json({
    message: "fetched chats succesfully",
    chats,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  const messages = await messageModel.deleteMany({ chat: chatId });

  if (!chat) {
    return res.status(404).json({
      message: "chat not found",
    });
  }
  res.status(200).json({
    message: "delete chat succesfully",
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
  if (!chat) {
    return res.status(400).json({
      message: "chat not found",
    });
  }
  const messages = await messageModel.find({ chat: chatId });
  res.status(200).json({
    message: "messages fetched succesfully",
    messages,
  });
}
