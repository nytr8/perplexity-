import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Edit,
  MessageSquare,
  Settings,
  Search,
  Share,
  Plus,
  Paperclip,
  Camera,
  Mic,
  Send,
  Copy,
} from "lucide-react";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

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
  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-gray-200 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-70 shrink-0 bg-[#131825]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 m-3 rounded-2xl relative z-10 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8 mt-1">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-bold text-white tracking-wide">
            SYNTH <span className="text-blue-500">AI</span>
          </span>
          <div className="ml-auto">
            <Sparkles className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        {/* New Chat Button */}
        <button className="w-full bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-all mb-6 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <Edit className="w-4 h-4" />
          <span className="text-[15px]">New Chat</span>
        </button>

        {/* History */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:hidden">
          {/* Today */}

          <div>
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-3">
              Today's History
            </h3>
            <div className="space-y-0.5">
              {Object.values(chats).map((chat, index) => {
                return (
                  <button
                    onClick={() => {
                      openChat(chat.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-[13px] bg-white/10 text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0 text-gray-300" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Older */}
          {/* <div>
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-3">
              Older History
            </h3>
            <div className="space-y-0.5 relative">
              <button className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-[13px] text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">Designing UI for chatbots...</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-[13px] text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">React hook explanation ...</span>
              </button>

           
              <div className="absolute -bottom-2 left-0 right-0 h-16 bg-gradient-to-t from-[#131825] to-transparent pointer-events-none"></div>
            </div>
          </div> */}

          {/* <button className="w-[calc(100%-8px)] mx-1 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 rounded-xl py-2 text-xs font-medium transition-colors mt-4">
            Load More
          </button> */}
        </div>

        {/* Account Settings */}
        <div className="pt-3 mt-2">
          <h3 className="text-xs font-semibold text-gray-400 px-2 mb-2">
            Account & Settings
          </h3>
          <div className="flex items-center justify-between px-2 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || "John"}&backgroundColor=transparent`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[13px] font-medium text-gray-200">
                {user?.name || "John Doe"}
              </span>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        {/* Header */}
        <header className="h-[76px] flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 relative z-10 w-full">
          <div className="flex flex-col justify-center">
            <h1 className="text-[17px] font-semibold text-gray-100 leading-tight">
              Chat with Synth (GPT-4o)
            </h1>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-400 mt-0.5">
              <span>Model:</span>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Balanced
              </button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-gray-200 transition-colors">
                Precise
              </button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-gray-200 transition-colors">
                Creative
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#131825] border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 w-48 focus:w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131825] hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium text-gray-300 transition-colors shadow-sm">
              <Share className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131825] hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium text-gray-300 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            {chats[currentChatId]?.messages.map((message, index) => {
              return message.role === "user" ? (
                // User Message
                <div key={index} className="flex gap-4 justify-end">
                  <div className="flex flex-col items-end gap-1 shrink-0 mt-1 max-w-full">
                    <div className="bg-[#1E3A8A]/40 backdrop-blur-md border border-blue-500/20 text-gray-100 px-5 py-3.5 rounded-[20px] rounded-tr-sm shadow-sm inline-block max-w-[90%]">
                      <p className="text-[15px] leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden ring-2 ring-[#0B0F19]">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${
                          user?.name || "John"
                        }&backgroundColor=transparent`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {user?.name?.split(" ")[0] || "John"} Doe
                    </span>
                  </div>
                </div>
              ) : (
                // AI Message
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#131825] to-[#1A2235] border border-white/10 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Synth
                    </span>
                  </div>

                  <div className="bg-[#131825]/60 backdrop-blur-md border border-white/5 text-gray-300 px-6 py-5 rounded-[20px] rounded-tl-sm w-[90%] shadow-sm space-y-4">
                    <p className="text-[15px] leading-relaxed text-gray-200">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#131825] to-[#1A2235] border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[10px] text-gray-400">Synth</span>
              </div>
              <div className="bg-[#131825]/60 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm mt-1">
                <span className="text-xs text-gray-400 font-medium">
                  Typing...
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-1.5 h-1.5 bg-[#2563EB]/70 rounded-full animate-[bounce_1s_infinite_150ms]"></div>
                  <div className="w-1.5 h-1.5 bg-[#2563EB]/40 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6 pt-2 relative z-10 w-full mt-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#131825]/80 backdrop-blur-xl border border-white/10 rounded-[28px] flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all focus-within:ring-1 focus-within:ring-white/20 p-2 pl-5 mt-4">
              <div className="flex flex-col justify-end min-h-[44px]">
                <textarea
                  rows="1"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-[15px] leading-relaxed py-2 resize-none max-h-32 [&::-webkit-scrollbar]:hidden"
                />

                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 border-t border-transparent">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors mr-auto -ml-3">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
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

            <div className="text-center mt-3 text-xs text-gray-500 font-medium">
              Synthesizing information... (Powered by GPT-4o)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
