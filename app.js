import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from "cors";
// import morgan from 'morgan'
import authrouter from './routes/auth.js'

dotenv.config()
const app=express();

// midleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//frontend problem
app.use(cors())



// routes
app.use("/",authrouter)
// app.use("/",productrouter)
// app.use("/",cartrouter)
// app.use("/",orderrouter)
// app.use("/",authrouter)


const PORT=process.env.PORT||3000
// connect mongo db atlas
mongoose.connect(process.env.MONGO_URL,{usenewurlparser:true,}).then(()=>{
    console.log("connected to mongodb atlas")
}).catch(error=>{
console.log("something wrong")
})

// server port
app.listen(PORT,()=>{
    console.log("server started at port http://localhost:3000");
})