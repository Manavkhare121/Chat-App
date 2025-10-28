import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";  
const server = http.createServer(app);
const Port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
