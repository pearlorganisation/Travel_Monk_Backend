import express from "express";
import {
  changePassword,
  forgotPassword,
  refreshAccessToken,
  resetPassword,
  getUserDetails,
} from "../../controllers/user/userController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/refresh-token").post(authenticateToken, refreshAccessToken);
router.route("/change-password").post(authenticateToken, changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/me").get(authenticateToken, getUserDetails);

export default router;
