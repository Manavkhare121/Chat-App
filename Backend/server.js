import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import http from "http"
import app from "./app.js"
const server =http.createServer(app);
const Port=process.env.PORT || 3000
server.listen(Port,()=>{
    console.log("server is running on port")
})