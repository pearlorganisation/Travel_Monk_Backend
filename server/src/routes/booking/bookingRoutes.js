import express from "express";
import {
  createBooking,
  verifyPayment,
} from "../../controllers/booking/bookingController.js";

const router = express.Router();

router.route("/").post(createBooking);
router.route("/verify-payment").post(verifyPayment);

export default router;
