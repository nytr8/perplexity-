import axios from "axios";

const app = axios.create({
  baseURL: "https://perplexity-useo.onrender.com",
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId, socketId, requestId }) => {
  const res = await app.post("/api/chats/message", {
    message,
    chat: chatId,
    socketId,
    requestId,
  });
  return res.data;
};

export const getChats = async () => {
  const res = await app.get("/api/chats/");
  return res.data;
};

export const getMessages = async (chatId) => {
  if (!chatId) {
    throw new Error("chatId is required to fetch messages");
  }
  const res = await app.get(`/api/chats/${chatId}/messages`);
  return res.data;
};

export const deleteChat = async ({ chatId }) => {
  const res = await app.delete(`/api/chats/delete/${chatId}`);
  return res.data;
};
