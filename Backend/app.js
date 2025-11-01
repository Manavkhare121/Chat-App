import express from "express"
import morgan from "morgan";
import userRoutes from  './routes/user.routes.js'
import cookieParser from "cookie-parser";
import cors from "cors"
const app =express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/users',userRoutes)
app.get('/',(req,res)=>{
    res.send("Hello world!")
})
export default app;