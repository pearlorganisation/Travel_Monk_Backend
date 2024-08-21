import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./src/routes/auth/authRoutes.js";
import userRoutes from "./src/routes/user/userRoutes.js";

// Create an Express application
const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

export { app };
