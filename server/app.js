import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dontenv from "dotenv";

// Create an Express application
const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

dontenv.config();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5173", "http://localhost:5174"]
        : ["https://travel-monk-mern.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods
    credentials: true,
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
import contactRouter from "./src/routes/contact/contactRoutes.js";
import destinationRouter from "./src/routes/destination/destinationRoutes.js";
import partnerTypeRouter from "./src/routes/partnerType/partnerTypesRoutes.js";
import partnerRouter from "./src/routes/partner/partnerRoutes.js";
import bookingRouter from "./src/routes/booking/bookingRoutes.js";
import vehicleRouter from "./src/routes/vehicle/vehicleRoutes.js";
import customizationEnquiry from "./src/routes/customizationEnquiry/customizationEnquiry.js";
import { errorHandler, notFound } from "./src/utils/errors/errorHandler.js";

app.get("/", (req, res) => {
  res.status(200).send("API Works!");
  console.log("This is Home route");
});

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/trips", tripsRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/destinations", destinationRouter);
app.use("/api/v1/partnerTypes", partnerTypeRouter);
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/customization-enquiry", customizationEnquiry);

app.use(notFound);
app.use(errorHandler);

export { app };
