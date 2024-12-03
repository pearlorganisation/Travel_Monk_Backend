import express from "express";
import {
  createBooking,
  preBuiltPackages,
  verifyPayment,
} from "../../controllers/booking/bookingController.js";

const router = express.Router();

router.route("/").post(createBooking);
router.route("/verify-payment").post(verifyPayment);
router.route("/pre-built-packages").get(preBuiltPackages); //For Admin 

export default router;
