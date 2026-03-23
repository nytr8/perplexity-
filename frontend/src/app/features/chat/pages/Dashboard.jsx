import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentChatId } from "../chat.slice.js";
import {
  Sparkles,
  Edit,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  Settings,
  UserRound,
  Share,
  Paperclip,
  Camera,
  Mic,
  Send,
} from "lucide-react";

const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [chatInput, setChatInput] = useState("");
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("perplexity-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const chats = useSelector((state) => state.chat.chats);
  const loading = useSelector((state) => state.chat.isLoading);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isDark = theme === "dark";

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    if (location.pathname === "/new-chat") {
      dispatch(setCurrentChatId(null));
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    localStorage.setItem("perplexity-theme", theme);
  }, [theme]);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    console.log(chats);
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const { user } = useSelector((state) => state.auth);

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setChatInput("");
    navigate("/new-chat");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    navigate("/");
  };

  const currentMessages = chats[currentChatId]?.messages || [];

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    const shouldDelete = window.confirm(
      "Delete this chat? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    await chat.handleDeleteChat(chatId);

    if (currentChatId === chatId) {
      setChatInput("");
      navigate("/new-chat");
    }
  };

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden ${
        isDark
          ? "bg-[#0B0F19] text-gray-200 selection:bg-blue-500/30"
          : "bg-[#F1F5FB] text-slate-800 selection:bg-sky-200"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-70 shrink-0 backdrop-blur-xl flex flex-col p-4 m-3 rounded-2xl relative z-10 shadow-2xl ${
          isDark
            ? "bg-[#131825]/80 border-r border-white/5"
            : "bg-white/90 border-r border-slate-200"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8 mt-1">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span
            className={`text-lg font-bold tracking-wide ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            PERPLEXITY <span className="text-blue-500">AI</span>
          </span>
          <div className="ml-auto">
            <Sparkles
              className={`w-4 h-4 ${isDark ? "text-gray-600" : "text-slate-300"}`}
            />
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-all mb-6 shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span className="text-[15px]">New Chat</span>
        </button>

        {/* History */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:hidden">
          <div>
            <h3
              className={`text-xs font-semibold px-2 mb-3 ${
                isDark ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Chat History
            </h3>
            <div className="space-y-0.5">
              {Object.values(chats).map((chat) => {
                return (
                  <div
                    key={chat.id}
                    className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-[13px] transition-colors ${
                      isDark
                        ? "text-white hover:bg-stone-200/15"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        openChat(chat.id);
                      }}
                      className="flex-1 min-w-0 text-left flex items-center gap-3  cursor-pointer"
                    >
                      <MessageSquare
                        className={`w-4 h-4 shrink-0 ${
                          isDark ? "text-gray-300" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{chat.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className={`p-1 cursor-pointer rounded-md hover:text-red-400 hover:bg-red-500/10 transition-colors ${
                        isDark ? "text-gray-400" : "text-slate-400"
                      }`}
                      aria-label={`Delete chat ${chat.title}`}
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="pt-3 mt-2">
          <h3
            className={`text-xs font-semibold px-2 mb-2 ${
              isDark ? "text-gray-400" : "text-slate-500"
            }`}
          >
            Account & Settings
          </h3>
          <div
            onClick={() => navigate("/profile")}
            className={`flex items-center justify-between px-2 cursor-pointer p-2 rounded-xl transition-colors ${
              isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <UserRound className="w-4 h-4" />
              </div>
              <span
                className={`text-[13px] font-medium ${
                  isDark ? "text-gray-200" : "text-slate-700"
                }`}
              >
                {user?.username || "User"}
              </span>
            </div>
            <Settings
              className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}
            />
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main
        className={`flex-1 flex flex-col relative min-w-0  ${
          isDark ? "bg-[#161b2a]" : "bg-[#EEF4FC]"
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 ${
            isDark ? "bg-blue-500/10" : "bg-sky-300/30"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3 ${
            isDark ? "bg-orange-500/5" : "bg-cyan-200/30"
          }`}
        ></div>

        {/* Header */}
        <header
          className={`h-[70px] flex-shrink-0 flex items-center justify-between px-8 relative z-10 w-full ${
            isDark ? "border-b border-white/5" : "border-b border-slate-200"
          }`}
        >
          <div className="flex flex-col justify-center">
            <h1
              className={`text-[17px] font-semibold leading-tight ${
                isDark ? "text-gray-100" : "text-slate-800"
              }`}
            >
              Chat with PERPLEXITY
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                isDark
                  ? "bg-[#131825] hover:bg-white/10 border border-white/5 text-gray-300"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {isDark ? "Light" : "Dark"}
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                isDark
                  ? "bg-[#131825] hover:bg-white/10 border border-white/5 text-gray-300"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              <Share className="w-4 h-4" />
              Share
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {!loading && currentMessages.length === 0 ? (
              <div className="min-h-[55vh] flex items-center justify-center px-4">
                <div className="text-center max-w-xl">
                  <p
                    className={`text-3xl font-semibold ${
                      isDark ? "text-gray-100" : "text-slate-800"
                    }`}
                  >
                    Welcome to PERPLEXITY AI
                  </p>
                  <p
                    className={`mt-3 text-sm ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Start a new conversation by typing your first message below.
                  </p>
                </div>
              </div>
            ) : null}

            {currentMessages.map((message, index) => {
              return message.role === "user" ? (
                // User Message
                <div key={index} className="flex gap-4 justify-end">
                  <div className="flex flex-col items-end gap-1 shrink-0 mt-1 max-w-full">
                    <div
                      className={`backdrop-blur-md px-5 py-3.5 rounded-[20px] rounded-tr-sm shadow-sm inline-block max-w-[90%] ${
                        isDark
                          ? "bg-[#1E3A8A]/40 border border-blue-500/20 text-gray-100"
                          : "bg-blue-100 border border-blue-200 text-slate-800"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden ring-2 ring-[#0B0F19]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        <UserRound className="w-4 h-4" />
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isDark ? "text-gray-400" : "text-slate-500"
                      }`}
                    >
                      {user?.username || "User"}
                    </span>
                  </div>
                </div>
              ) : (
                // AI Message
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        isDark
                          ? "bg-gradient-to-br from-[#131825] to-[#1A2235] border border-white/10"
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        isDark ? "text-gray-400" : "text-slate-500"
                      }`}
                    >
                      perplexity
                    </span>
                  </div>

                  <div
                    className={`backdrop-blur-md px-6 py-5 rounded-[20px] rounded-tl-sm w-[90%] shadow-sm space-y-4 ${
                      isDark
                        ? "bg-[#131825]/60 border border-white/5 text-gray-300"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    <div
                      className={`ai-markdown text-[15px] leading-relaxed ${
                        isDark ? "text-gray-200" : "light text-slate-700"
                      }`}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading ? (
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark
                        ? "bg-gradient-to-br from-[#131825] to-[#1A2235] border border-white/10"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <span
                    className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}
                  >
                    Synth
                  </span>
                </div>
                <div
                  className={`backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm mt-1 ${
                    isDark
                      ? "bg-[#131825]/60 border border-white/5"
                      : "bg-white border border-slate-200"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Typing...
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                    <div className="w-1.5 h-1.5 bg-[#2563EB]/70 rounded-full animate-[bounce_1s_infinite_150ms]"></div>
                    <div className="w-1.5 h-1.5 bg-[#2563EB]/40 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6 pt-2 bg-transparent relative z-10 mt-auto">
          <div
            className={`max-w-4xl mx-auto relative rounded-4xl transition-all ease-in duration-300 ${
              isInputExpanded ? "w-full " : "w-40  rounded-full"
            } ${
              isDark
                ? "shadow-[0px_0px_10px_0px_#155DFC]"
                : "shadow-[0px_0px_12px_0px_rgba(56,189,248,0.35)]"
            }`}
          >
            <div
              className={`relative backdrop-blur-xl rounded-[28px] flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all p-2 pl-5 mt-4 focus-within:ring-1 ${
                isInputExpanded ? "w-full " : "w-40  rounded-full"
              } ${
                isDark
                  ? "bg-[#131825]/80 border border-white/10 focus-within:ring-white/20"
                  : "bg-white/90 border border-slate-200 focus-within:ring-slate-300"
              }`}
            >
              <div className="flex flex-col justify-end min-h-[44px]">
                <textarea
                  rows="1"
                  placeholder="Type a message..."
                  value={chatInput}
                  onFocus={() => setIsInputExpanded(true)}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`w-full bg-transparent focus:outline-none text-[15px] leading-relaxed py-2 resize-none max-h-32 [&::-webkit-scrollbar]:hidden ${
                    isDark
                      ? "text-gray-100 placeholder-gray-500"
                      : "text-slate-700 placeholder-slate-400"
                  }`}
                />

                <div
                  className={`flex items-center gap-1.5 shrink-0 pt-2 border-t border-transparent ${
                    isInputExpanded ? "justify-end" : "justify-center"
                  }`}
                >
                  {isInputExpanded ? (
                    <>
                      <button
                        className={`p-2 rounded-full transition-colors mr-auto -ml-3 ${
                          isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <button
                        className={`p-2 rounded-full transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Camera className="w-5 h-5" />
                      </button>

                      <button
                        className={`p-2 rounded-full transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </>
                  ) : null}

                  <button
                    className="ml-1 px-4 py-2 bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 text-white rounded-full font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    onClick={handleSubmitMessage}
                  >
                    Send
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
