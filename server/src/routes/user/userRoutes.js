import express from "express";
import {
  changePassword,
  forgotPassword,
  refreshAccessToken,
  resetPassword,
  getUserDetails,
  getAllUsers,
} from "../../controllers/user/userController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router.route("/refresh-token").post(authenticateToken, refreshAccessToken);
router.route("/change-password").post(authenticateToken, changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/me").get(authenticateToken, getUserDetails);
// router.route("/bookings").get(authenticateToken, getMyBookings)
router
  .route("/")
  .get(authenticateToken, verifyPermission([UserRolesEnum.ADMIN]), getAllUsers);

export default router;
