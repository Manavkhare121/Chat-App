import express from "express"
import morgan from "morgan";
import userRoutes from  './routes/user.routes.js'
import ProjectRoutes from './routes/project.routes.js'
import cookieParser from "cookie-parser";
import cors from "cors"
const app =express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/users',userRoutes)
app.use('/projects',ProjectRoutes)
app.get('/',(req,res)=>{
    res.send("Hello world!")
})
export default app;