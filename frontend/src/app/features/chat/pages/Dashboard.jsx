import React from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import { useEffect } from "react";
const Dashboard = () => {
  const chat = useChat();
  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const { user } = useSelector((state) => state.auth);
  console.log(user);
  return <div className="text-white">Dashboard</div>;
};

export default Dashboard;
