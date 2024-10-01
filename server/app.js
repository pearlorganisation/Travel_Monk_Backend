import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

// Create an Express application
const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.json());
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

//Routes imports
import authRouter from "./src/routes/auth/authRoutes.js";
import userRouter from "./src/routes/user/userRoutes.js";
import hotelRouter from "./src/routes/hotel/hotelRoutes.js";
import packageRouter from "./src/routes/package/packageRoutes.js";
import tripsRouter from "./src/routes/trips/tripsRoutes.js";
import activityRouter from "./src/routes/activity/activityRoutes.js";
// import itineraryRouter from "./src/routes/itinerary/itineraryRoutes.js";
import contactRouter from "./src/routes/contact/contactRoutes.js";
import { errorHandler, notFound } from "./src/utils/errors/errorHandler.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/trips", tripsRouter);
// app.use("/api/v1/itineraries", itineraryRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/activity", activityRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
