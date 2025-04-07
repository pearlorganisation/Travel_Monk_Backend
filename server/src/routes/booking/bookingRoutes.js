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
router
  .route("/pre-built-package-enquiry")
  .get(authenticateToken, getAllPreBuiltPackageEnquiryBookings); // works for both user and admin

router
  .route("/fully-customize-package-enquiry")
  .get(authenticateToken, getAllFullyCustomizeEnquiryBookings);

router.route("/").get(
  authenticateToken,
  verifyPermission([UserRolesEnum.ADMIN]),
  getAllBookings // Pre-built package bookings
); //For Admin

router
  .route("/pre-built-package-enquiry/verify-payment")
  .post(authenticateToken, verifyPreBuiltPackageEnquiryPayment);

router
  .route("/fully-customize-package-enquiry/verify-payment")
  .post(authenticateToken, verifyFullyCustomizeEnquiryPayment);

router
  .route("/pre-built-package-enquiry/:id") // id of pre-built package enquiry
  .post(authenticateToken, createPreBuiltPackageEnquiryBooking); // Create new enquiry
// .patch(updatePreBuiltPackageEnquiryBooking); // Update an existing enquiry

router
  .route("/fully-customize-package-enquiry/:id")
  .post(authenticateToken, createFullyCustomizeEnquiryBooking);

router.route("/:bookingId").get(authenticateToken, getBookingById); // For admin and user

export default router;
