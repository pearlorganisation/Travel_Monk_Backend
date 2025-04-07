import express from "express";
import {
  createBooking,
  createFullyCustomizeEnquiryBooking,
  createPreBuiltPackageEnquiryBooking,
  getAllBookings,
  getAllFullyCustomizeEnquiryBookings,
  getAllPreBuiltPackageEnquiryBookings,
  getBookingById,
  myBookings,
  verifyFullyCustomizeEnquiryPayment,
  verifyPayment,
  verifyPreBuiltPackageEnquiryPayment,
} from "../../controllers/booking/bookingController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";
import { createFullyCustomizeEnquiry } from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";

const router = express.Router();

router.route("/").post(authenticateToken, createBooking);
router.route("/verify-payment").post(authenticateToken, verifyPayment);
router.route("/me").get(authenticateToken, myBookings);

//GET bookings of PRE BUILT PACKAGE ENQUIRY done by user and also get the all booking for admin panel
router
  .route("/pre-built-package-enquiry")
  .get(authenticateToken, getAllPreBuiltPackageEnquiryBookings); // works for both user and admin

//GET bookings of FULLY CUSTOMIZE PACKAGE ENQUIRY done by user and also get the all booking for admin panel
router
  .route("/fully-customize-package-enquiry")
  .get(authenticateToken, getAllFullyCustomizeEnquiryBookings);

router.route("/").get(
  authenticateToken,
  verifyPermission([UserRolesEnum.ADMIN]),
  getAllBookings // Pre-built package bookings
); //For Admin

// VERIFY PAYMENT FOR PRE BUILT PACKAGE ENQUIRY BOOKING
router
  .route("/pre-built-package-enquiry/verify-payment")
  .post(authenticateToken, verifyPreBuiltPackageEnquiryPayment);

// VERIFY PAYMENT FOR FULLY CUSTOMIZE PACKAGE ENQUIRY BOOKING
router
  .route("/fully-customize-package-enquiry/verify-payment")
  .post(authenticateToken, verifyFullyCustomizeEnquiryPayment);

// CREATE ORDER FOR PRE BUILT PACKAGE ENQUIRY
router
  .route("/pre-built-package-enquiry/:id") // id of pre-built package enquiry
  .post(authenticateToken, createPreBuiltPackageEnquiryBooking); // Create new enquiry
// .patch(updatePreBuiltPackageEnquiryBooking); // Update an existing enquiry

// CREATE ORDER FOR FULLY CUSTOMIZE PACKAGE ENQUIRY
router
  .route("/fully-customize-package-enquiry/:id")
  .post(authenticateToken, createFullyCustomizeEnquiryBooking);

router.route("/:bookingId").get(authenticateToken, getBookingById); // For admin and user

export default router;
