import { initializeSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../services/chat.api";

import { useDispatch } from "react-redux";
export const useChat = () => {
  const dispatch = useDispatch();
  
  return {
    initializeSocketConnection,
  };
};
