import express from "express";
import {
  changePassword,
  forgotPassword,
  refreshAccessToken,
  resetPassword,
  getUserDetails,
  getAllUsers,
  updateUserDetails,
  getUsersCustomPackage,
  createUser,
} from "../../controllers/user/userController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(authenticateToken, changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router
  .route("/me")
  .get(authenticateToken, getUserDetails)
  .patch(authenticateToken, updateUserDetails);
router
  .route("/")
  .get(authenticateToken, verifyPermission([UserRolesEnum.ADMIN]), getAllUsers);

router.route("/custom-packages").get(authenticateToken, getUsersCustomPackage); // getting custom package for user created by admin
router
  .route("/")
  .post(authenticateToken, verifyPermission([UserRolesEnum.ADMIN]), createUser); // For admin panel

export default router;
