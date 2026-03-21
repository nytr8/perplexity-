import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
  const res = api.post("/api/chats/message", {
    message,
    chatId,
  });
  return res.data;
};

export const getChats = async ({ message, chatId }) => {
  const res = api.get("/api/chats/");
  return res.data;
};

export const getMessages = async ({ chatId }) => {
  const res = api.get(`/api/chats/:${chatId}/messages`);
  return res.data;
};

export const deleteChat = async ({ chatId }) => {
  const res = api.delete(`/api/chats/delete/:${chatId}`);
  return res.data;
};
