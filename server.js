import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./Routes/UserRouter.js"; // Fixed spacing issue
import { errorHandler } from "./middlewares/errorMiddleware.js"; // Fixed folder name

dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit i.jsf DB connection fails
  });

// Basic API Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// User Routes
app.use("/api/user", userRouter);

// Error Handling Middleware
app.use(errorHandler);

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
