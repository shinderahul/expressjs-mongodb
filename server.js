const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Auth Routes
app.use("/auth", authRoutes);

// Post /todos - Add a new todo
app.use("/api", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  const mongoose = require("mongoose");
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
