import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Must be a specific URL (Cannot be "*")
  credentials: true                // Allows cookies to travel across origins
}));


app.use(bodyParser.json());
app.use('/api/v1',userRoutes);
app.use('/api/v1/transactions',transactionRoutes);

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log("listening at port : ", port);
});