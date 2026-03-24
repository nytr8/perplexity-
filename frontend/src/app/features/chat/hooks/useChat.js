import {
  getSocketConnection,
  initializeSocketConnection as connectSocket,
} from "../services/chat.socket";
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
  startStreamingMessage,
  appendStreamingMessage,
  finalizeStreamingMessage,
  setStreamingError,
} from "../chat.slice.js";
import { useDispatch } from "react-redux";

function generateRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function resolveSocketId(socket) {
  if (!socket) {
    return Promise.resolve(null);
  }

  if (socket.connected && socket.id) {
    return Promise.resolve(socket.id);
  }

  socket.connect();

  return new Promise((resolve) => {
    const onConnect = () => {
      clearTimeout(timer);
      resolve(socket.id || null);
    };

    const timer = setTimeout(() => {
      socket.off("connect", onConnect);
      resolve(null);
    }, 1500);

    socket.once("connect", onConnect);
  });
}

export const useChat = () => {
  const dispatch = useDispatch();

  function initializeSocketConnection() {
    const socket = connectSocket();

    socket.removeAllListeners("chat:stream:start");
    socket.removeAllListeners("chat:stream:delta");
    socket.removeAllListeners("chat:stream:end");
    socket.removeAllListeners("chat:stream:error");

    socket.on("chat:stream:start", (payload = {}) => {
      const resolvedChatId = payload?.chatId?.toString();

      if (!resolvedChatId) {
        return;
      }

      if (payload?.title) {
        dispatch(
          createNewChat({
            chatId: resolvedChatId,
            title: payload.title,
          }),
        );
      }

      if (payload?.userMessage?.content) {
        dispatch(
          addNewMessage({
            chatId: resolvedChatId,
            content: payload.userMessage.content,
            role: payload.userMessage.role || "user",
            messageId: payload.userMessage.id,
          }),
        );
      }

      dispatch(setCurrentChatId(resolvedChatId));
      dispatch(
        startStreamingMessage({
          chatId: resolvedChatId,
          streamId: payload.requestId || null,
        }),
      );
    });

    socket.on("chat:stream:delta", (payload = {}) => {
      const resolvedChatId = payload?.chatId?.toString();
      if (!resolvedChatId || !payload?.delta) {
        return;
      }

      dispatch(
        appendStreamingMessage({
          chatId: resolvedChatId,
          streamId: payload.requestId || null,
          delta: payload.delta,
        }),
      );
    });

    socket.on("chat:stream:end", (payload = {}) => {
      const resolvedChatId = payload?.chatId?.toString();
      if (!resolvedChatId) {
        return;
      }

      dispatch(
        finalizeStreamingMessage({
          chatId: resolvedChatId,
          streamId: payload.requestId || null,
          content: payload?.aiMessage?.content,
          messageId: payload?.aiMessage?.id,
        }),
      );
    });

    socket.on("chat:stream:error", (payload = {}) => {
      const resolvedChatId = payload?.chatId?.toString();

      if (resolvedChatId) {
        dispatch(
          setStreamingError({
            chatId: resolvedChatId,
            streamId: payload.requestId || null,
          }),
        );
      }

      dispatch(setError(payload?.message || "Failed to stream AI response."));
    });

    return () => {
      socket.off("chat:stream:start");
      socket.off("chat:stream:delta");
      socket.off("chat:stream:end");
      socket.off("chat:stream:error");
    };
  }

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const socket = getSocketConnection() || connectSocket();
      const socketId = await resolveSocketId(socket);
      const requestId = generateRequestId();

      const data = await sendMessage({ message, chatId, socketId, requestId });
      const { chat, aiMessage } = data;
      const resolvedChatId = chatId || chat?._id;

      if (!resolvedChatId) {
        throw new Error("Could not resolve chat id for this message.");
      }

      if (!socketId && !chatId && chat) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      if (!socketId) {
        dispatch(
          addNewMessage({
            chatId: resolvedChatId,
            content: message,
            role: "user",
            messageId: data?.userMessage?._id,
          }),
        );

        if (aiMessage?.content) {
          dispatch(
            addNewMessage({
              chatId: resolvedChatId,
              content: aiMessage.content,
              role: aiMessage.role,
              messageId: aiMessage?._id,
            }),
          );
        }
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
        id: msg._id,
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
