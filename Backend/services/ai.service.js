import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash",
  generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
   systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.Examples: 

    <example>

response: {
"text": "this is your fileTree structure",
"fileTree": {
    "app.js": {
        "file": {
            "contents":  "
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import http from 'http';
import app from './app.js';
import connectDB from './db/db.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ProjectModel } from './models/project.model.js';
import { generateAI } from './services/ai.service.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];

    const projectId = socket.handshake.query.projectId;

    if (!token) {
      return next(new Error('Authorization error'));
    }

    socket.project = await ProjectModel.findById(projectId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error('Authentication error'));
    }

    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', socket => {
  console.log('A user connected');
  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);

  socket.on('project-message', async data => {
    const message = data.message;
    const AiIsPresentInMessage = message.includes('@ai');

    if (AiIsPresentInMessage) {
      const prompt = message.replace('@ai', '');
      const result = await generateAI(prompt);

      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          _id: 'ai',
          email: 'AI'
        }
      });
      return;
    }

    socket.broadcast.to(socket.roomId).emit('project-message', {
      sender: data.sender,
      message: data.message,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.leave(socket.roomId);
  });
});

const Port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(Port, () => {
      console.log(\`Server is running on port \${Port}\`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
"
        }
    },

    "package.json": {
        "file": {
            "contents": "
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "express-validator": "^7.3.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.20.0",
    "mongoose": "^8.19.2",
    "morgan": "^1.10.1",
    "socket.io": "^4.8.1"
  }
}
"
        }
    }
},

"buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
},

"startCommand": {
    "mainItem": "npm",
    "commands": ["start"]
}
}

user: Create an express application

</example>



    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       
       


   `
 });
export async function generateAI(prompt) {
  const result = await model.generateContent({
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  });
  return result.response.text();
}
