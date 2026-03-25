import connectDB from "./src/config/db.js";
import app from "./src/app.js";

import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";
const httpServer = http.createServer(app);
connectDB();
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
