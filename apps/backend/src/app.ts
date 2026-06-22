import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is healthy" });
});

app.use("/api/v1", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

export default app;
