import express from "express";
import {
  createCustomPackage,
  deleteCustomPackage,
  getCustomPackages,
} from "../../controllers/customPackage/customPackageController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, createCustomPackage)
  .get(authenticateToken, getCustomPackages);
router.route("/:id").delete(authenticateToken, deleteCustomPackage);

export default router;
