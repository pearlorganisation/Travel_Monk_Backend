import express from "express";
import {
  createBooking,
  myBookings,
  preBuiltPackages,
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
router
  .route("/pre-built-packages")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    preBuiltPackages
  ); //For Admin

export default router;
