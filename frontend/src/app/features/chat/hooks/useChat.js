import { initializeSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../services/chat.api";
import {
  addMessages,
  addNewMessage,
  createNewChat,
  removeChat,
  setError,
  setChats,
  setCurrentChatId,
  setLoading,
} from "../chat.slice.js";
import { useDispatch } from "react-redux";
export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      const resolvedChatId = chatId || chat?._id;

      if (!resolvedChatId) {
        throw new Error("Could not resolve chat id for this message.");
      }

      if (!chatId && chat) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(
        addNewMessage({
          chatId: resolvedChatId,
          content: message,
          role: "user",
        }),
      );

      if (aiMessage?.content) {
        dispatch(
          addNewMessage({
            chatId: resolvedChatId,
            content: aiMessage.content,
            role: aiMessage.role,
          }),
        );
      }

      dispatch(setCurrentChatId(resolvedChatId));
    } catch (error) {
      dispatch(setError(error?.message || "Failed to send message."));
      console.error("handleSendMessage failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetChats() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
    } catch (error) {
      dispatch(setError(error?.message || "Failed to fetch chats."));
      console.error("handleGetChats failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleOpenChat(chatId, chats) {
    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }
    dispatch(setCurrentChatId(chatId));
  }

  async function handleDeleteChat(chatId) {
    dispatch(setError(null));
    try {
      await deleteChat({ chatId });
      dispatch(removeChat(chatId));
    } catch (error) {
      dispatch(setError(error?.message || "Failed to delete chat."));
      console.error("handleDeleteChat failed:", error);
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
  };
};
