import express from "express";
import {
  createCustomPackage,
  deleteCustomPackage,
  getCustomPackages,
  updateCustomPackageById,
} from "../../controllers/customPackage/customPackageController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    createCustomPackage
  )
  .get(authenticateToken, getCustomPackages);
router
  .route("/:id")
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateCustomPackageById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteCustomPackage
  );

export default router;
