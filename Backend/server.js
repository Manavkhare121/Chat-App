import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";
import {Server} from "socket.io";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { ProjectModel } from "./models/project.model.js";
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:'*'
  }
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];
    const projectId=socket.handshake.query.projectId;
    
    if (!token) {
      return next(new Error('Authorization error'));
    }
    socket.project=await ProjectModel.findById(projectId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     if (!decoded) {
            return next(new Error('Authentication error'))
        }

    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', socket => {
  console.log("a User Connected")
  socket.roomId=socket.project._id.toString()
  socket.join(socket.roomId)
  socket.on('project-message',data=>{
    console.log(data)
    socket.broadcast.to(socket.roomId).emit('project-message',data)
  })
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});

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

