import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  myBookings,
  verifyPayment,
} from "../../controllers/booking/bookingController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router.route("/").post(authenticateToken, createBooking);
router.route("/verify-payment").post(authenticateToken, verifyPayment);
router.route("/me").get(authenticateToken, myBookings);
router.route("/").get(
  authenticateToken,
  verifyPermission([UserRolesEnum.ADMIN]),
  getAllBookings // Pre-built package bookings
); //For Admin

router.route("/:bookingId").get(authenticateToken, getBookingById); // For admin and user

export default router;
