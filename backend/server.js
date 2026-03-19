import connectDB from "./src/config/db.js";
import app from "./src/app.js";
// import { interactiveChat } from "./src/services/ai.service.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";
const httpServer = http.createServer(app);
connectDB();
initSocket(httpServer);
// interactiveChat();
httpServer.listen(3000, () => {
  console.log("server running in port 3000");
});
