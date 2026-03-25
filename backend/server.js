import connectDB from "./src/config/db.js";
import app from "./src/app.js";

import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";
const httpServer = http.createServer(app);
connectDB();
initSocket(httpServer);

httpServer.listen("https://perplexity-clone-q32m.onrender.com", () => {
  console.log("server running in port 3000");
});
