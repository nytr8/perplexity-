import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { main } from "./src/services/ai.service.js";

connectDB();

// main();
app.listen(3000, () => {
  console.log("connected to port 3000");
});
