import express from 'express';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();
dotenv.config()
app.use(cors({
    origin: 'http://localhost:5173', // Replace this with the actual frontend domain
    credentials: true, // Allow cookies to be sent with requests
  }));
  
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// steP1 ; create a route
app.use('/api/auth',authRoutes)

app.use("/api/message", messageRoutes);
app.listen(process.env.PORT || 3000  ,()=>{
    console.log('Server is running on port 3000')
    connectDB();
});
