import express from "express";
import { createCustomPackage } from "../../controllers/customPackage/customPackageController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateToken, createCustomPackage);

export default router;
