import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocketConnection = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io("http://localhost:3000", {
    withCredentials: true,
  });

  socketInstance.on("connect", () => {
    console.log("connected to socket io server", socketInstance.id);
  });

  return socketInstance;
};

export const getSocketConnection = () => socketInstance;

export const disconnectSocketConnection = () => {
  if (!socketInstance) {
    return;
  }

  socketInstance.disconnect();
  socketInstance = null;
};
