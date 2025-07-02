const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/Todo-route");
const cors = require("cors");
const connectDB = require("./utils/db");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/todos", todoRoutes);

const StartServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};
StartServer();
