import chatModel from "../models/chat.js";
import {
  generateResponse,
  generateResponseStream,
  generateTitle,
} from "../services/ai.service.js";
import messageModel from "../models/message.js";
import { getIO } from "../sockets/server.socket.js";

function emitStreamEvent(socketId, eventName, payload) {
  if (!socketId) {
    return;
  }

  try {
    getIO().to(socketId).emit(eventName, payload);
  } catch (error) {
    console.error(`Socket emit failed for ${eventName}:`, error);
  }
}

export async function sendMessage(req, res) {
  const { message, chat: chatId, socketId, requestId } = req.body;

  let currentChatId = chatId;

  try {
    let chat = null,
      title = null;

    if (!chatId) {
      title = await generateTitle(message);
      chat = await chatModel.create({
        user: req.user.id,
        title: title,
      });
    }
    currentChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
      chat: currentChatId,
      content: message,
      role: "user",
    });

    emitStreamEvent(socketId, "chat:stream:start", {
      requestId,
      chatId: currentChatId,
      title: title || chat?.title,
      userMessage: {
        id: userMessage._id?.toString(),
        content: userMessage.content,
        role: userMessage.role,
      },
    });

    const messages = await messageModel.find({ chat: currentChatId });

    const result = socketId
      ? await generateResponseStream(messages, (delta) => {
          emitStreamEvent(socketId, "chat:stream:delta", {
            requestId,
            chatId: currentChatId,
            delta,
          });
        })
      : await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: currentChatId,
      content: result,
      role: "ai",
    });

    emitStreamEvent(socketId, "chat:stream:end", {
      requestId,
      chatId: currentChatId,
      aiMessage: {
        id: aiMessage._id?.toString(),
        content: aiMessage.content,
        role: aiMessage.role,
      },
    });

    res.status(201).json({
      title,
      chat,
      requestId,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    emitStreamEvent(socketId, "chat:stream:error", {
      requestId,
      chatId: currentChatId,
      message: "Failed to generate AI response.",
    });

    return res.status(500).json({
      message: error?.message || "Failed to send message.",
    });
  }
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
