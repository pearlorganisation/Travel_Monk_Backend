import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dontenv from "dotenv";
import { fileURLToPath } from "url";

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
        ? [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
          ]
        : ["https://travel-monk-mern.vercel.app","https://travel-monk-admin.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("public")); This serves all files in the public directory at the root of your server.
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); //This serves only files in the public/uploads directory under the /uploads route.

app.use(cookieParser());
app.use(morgan("dev"));

//Routes imports
import authRouter from "./src/routes/auth/authRoutes.js";
import userRouter from "./src/routes/user/userRoutes.js";
import hotelRouter from "./src/routes/hotel/hotelRoutes.js";
import packageRouter from "./src/routes/package/packageRoutes.js";
import customPackageRouter from "./src/routes/customPackage/customPackageRoutes.js";
import activityRouter from "./src/routes/activity/activityRoutes.js";
import contactRouter from "./src/routes/contact/contactRoutes.js";
import destinationRouter from "./src/routes/destination/destinationRoutes.js";
import partnerTypeRouter from "./src/routes/partnerType/partnerTypesRoutes.js";
import partnerRouter from "./src/routes/partner/partnerRoutes.js";
import bookingRouter from "./src/routes/booking/bookingRoutes.js";
import vehicleRouter from "./src/routes/vehicle/vehicleRoutes.js";
import preBuiltCustomizationEnquiryRouter from "./src/routes/customizationEnquiry/preBuiltCustomizationEnquiryRoutes.js";
import fullyCustomizationEnquiryRouter from "./src/routes/customizationEnquiry/fullyCustomizationEnquiryRoutes.js";
import { notFound, errorHandler } from "./src/utils/errors/errorHandler.js";

app.get("/", (req, res) => {
  res.status(200).send("API Works!");
  console.log("This is Home route");
});

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/custom-packages", customPackageRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/destinations", destinationRouter);
app.use("/api/v1/partnerTypes", partnerTypeRouter);
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use(
  "/api/v1/customization-enquiries/pre-built",
  preBuiltCustomizationEnquiryRouter
);
app.use(
  "/api/v1/customization-enquiries/fully-customize",
  fullyCustomizationEnquiryRouter
);

app.use(notFound);
app.use(errorHandler);

export { app };
