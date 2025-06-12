import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/database";
import todoRoutes from "./routes/todo";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Auth Routes
app.use("/auth", authRoutes);

// Todo Routes
app.use("/api", todoRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await mongoose.connection.close();
  server.close(() => {
    process.exit(0);
  });
});

export default app;
