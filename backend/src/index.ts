import express from 'express';
import userRouter from './routes/userRoutes';
const app = express();
const port = 3000;
import dotenv from "dotenv";
import { dbConnect } from './helper/dbConnect';
import cors from 'cors';
import accountRouter from './routes/accountRoutes';
dotenv.config();
dbConnect();
app.use(cors())
app.use('/api/v1/user',userRouter);
app.use('/api/v1/account',accountRouter);
app.listen(port,()=>{console.log("listening at port : 3000")})



