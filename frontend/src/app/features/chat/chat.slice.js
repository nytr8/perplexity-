import { createSlice } from "@reduxjs/toolkit";

function ensureChat(state, chatId, title = null) {
  if (!state.chats[chatId]) {
    state.chats[chatId] = {
      id: chatId,
      title: title || "New Chat",
      messages: [],
      lastUpdated: new Date().toISOString(),
    };
  } else if (title && state.chats[chatId].title !== title) {
    state.chats[chatId].title = title;
  }
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      ensureChat(state, chatId, title);
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role, messageId } = action.payload;
      ensureChat(state, chatId);

      const chat = state.chats[chatId];
      if (messageId && chat.messages.some((msg) => msg.id === messageId)) {
        return;
      }

      chat.messages.push({
        id: messageId || null,
        content,
        role,
        isStreaming: false,
        streamId: null,
      });
      chat.lastUpdated = new Date().toISOString();
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      ensureChat(state, chatId);
      const existingIds = new Set(
        state.chats[chatId].messages.map((message) => message.id),
      );
      const mappedMessages = messages
        .filter((message) => !message.id || !existingIds.has(message.id))
        .map((message) => ({
          id: message.id || null,
          content: message.content,
          role: message.role,
          isStreaming: false,
          streamId: null,
        }));

      state.chats[chatId].messages.push(...mappedMessages);
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },
    startStreamingMessage: (state, action) => {
      const { chatId, streamId } = action.payload;
      ensureChat(state, chatId);
      const chat = state.chats[chatId];

      const existingStreamingMessage = chat.messages.find(
        (message) => message.streamId === streamId,
      );

      if (existingStreamingMessage) {
        return;
      }

      chat.messages.push({
        id: null,
        content: "",
        role: "ai",
        isStreaming: true,
        streamId: streamId || null,
      });
      chat.lastUpdated = new Date().toISOString();
    },
    appendStreamingMessage: (state, action) => {
      const { chatId, streamId, delta } = action.payload;
      ensureChat(state, chatId);
      const chat = state.chats[chatId];

      let targetMessage = null;

      if (streamId) {
        targetMessage = [...chat.messages]
          .reverse()
          .find((message) => message.streamId === streamId);
      }

      if (!targetMessage) {
        targetMessage = [...chat.messages]
          .reverse()
          .find((message) => message.role === "ai" && message.isStreaming);
      }

      if (!targetMessage) {
        chat.messages.push({
          id: null,
          content: delta,
          role: "ai",
          isStreaming: true,
          streamId: streamId || null,
        });
      } else {
        targetMessage.content += delta;
      }

      chat.lastUpdated = new Date().toISOString();
    },
    finalizeStreamingMessage: (state, action) => {
      const { chatId, streamId, content, messageId } = action.payload;
      ensureChat(state, chatId);
      const chat = state.chats[chatId];

      let targetMessage = null;

      if (streamId) {
        targetMessage = [...chat.messages]
          .reverse()
          .find((message) => message.streamId === streamId);
      }

      if (!targetMessage) {
        targetMessage = [...chat.messages]
          .reverse()
          .find((message) => message.role === "ai" && message.isStreaming);
      }

      if (!targetMessage) {
        chat.messages.push({
          id: messageId || null,
          content: content || "",
          role: "ai",
          isStreaming: false,
          streamId: null,
        });
      } else {
        if (typeof content === "string" && content.length > 0) {
          targetMessage.content = content;
        }
        targetMessage.id = messageId || targetMessage.id || null;
        targetMessage.isStreaming = false;
        targetMessage.streamId = null;
      }

      chat.lastUpdated = new Date().toISOString();
    },
    setStreamingError: (state, action) => {
      const { chatId, streamId } = action.payload;
      ensureChat(state, chatId);
      const chat = state.chats[chatId];

      const targetMessage = [...chat.messages]
        .reverse()
        .find((message) => {
          if (streamId) {
            return message.streamId === streamId;
          }
          return message.role === "ai" && message.isStreaming;
        });

      if (targetMessage) {
        targetMessage.isStreaming = false;
        targetMessage.streamId = null;
      }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];

      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetChatState: () => ({
      chats: {},
      currentChatId: null,
      isLoading: false,
      error: null,
    }),
  },
});

export const {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
  startStreamingMessage,
  appendStreamingMessage,
  finalizeStreamingMessage,
  setStreamingError,
  resetChatState,
} = chatSlice.actions;
export default chatSlice.reducer;
