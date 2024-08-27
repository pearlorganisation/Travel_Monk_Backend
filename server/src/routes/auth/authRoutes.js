import express from "express";
import {
  signup,
  login,
  logout,
  verifySignUpToken,
} from "../../controllers/auth/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(authenticateToken, logout);

router.route("/verify-signup/:token").get(verifySignUpToken);
  
export default router;
