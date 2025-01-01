import express from "express";
import {
  createPreBuiltPackageCustomizationEnquiry,
  deletePreBuiltPackageCustomizationEnquiryById,
  getAllPreBuiltPackageCustomizationEnquiries,
  getPreBuiltPackageCustomizationEnquiryById,
} from "../../controllers/customizationEnquiry/prebuiltCustomizationEnquiryController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(createPreBuiltPackageCustomizationEnquiry)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllPreBuiltPackageCustomizationEnquiries
  );

router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getPreBuiltPackageCustomizationEnquiryById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePreBuiltPackageCustomizationEnquiryById
  );

export default router;
