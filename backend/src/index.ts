import express from 'express';
import userRouter from './routes/userRoutes';
const app = express();
const port = 3000;
import dotenv from "dotenv";
import { dbConnect } from './helper/dbConnect';
import cors from 'cors';
dotenv.config();
dbConnect();
app.use(cors())
app.use('/user',userRouter);
app.listen(port,()=>{console.log("listening at port : 3000")})



