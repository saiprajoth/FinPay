import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://fin-pay-frontend.vercel.app",
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is healthy" });
});

app.use("/api/v1", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

export default app;
