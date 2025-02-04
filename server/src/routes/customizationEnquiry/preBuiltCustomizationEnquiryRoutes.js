import express from "express";
import {
  createPreBuiltPackageCustomizationEnquiry,
  deletePreBuiltPackageCustomizationEnquiryById,
  getAllPreBuiltPackageCustomizationEnquiries,
  getMyPreBuiltPackageCustomizationEnquiries,
  getPreBuiltPackageCustomizationEnquiryById,
  updatePreBuiltPackageCustomizationEnquiryById,
} from "../../controllers/customizationEnquiry/prebuiltCustomizationEnquiryController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, createPreBuiltPackageCustomizationEnquiry)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllPreBuiltPackageCustomizationEnquiries
  );

router
  .route("/my-enquiries")
  .get(authenticateToken, getMyPreBuiltPackageCustomizationEnquiries);

router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getPreBuiltPackageCustomizationEnquiryById
  )
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updatePreBuiltPackageCustomizationEnquiryById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePreBuiltPackageCustomizationEnquiryById
  );

export default router;
