import express from "express";
import {
  createPreBuiltPackageCustomizationEnquiry,
  deletePreBuiltPackageCustomizationEnquiryById,
  getAllPreBuiltPackageCustomizationEnquiries,
  getPreBuiltPackageCustomizationEnquiryById,
} from "../../controllers/customizationEnquiry/prebuiltCustomizationEnquiryController.js";

const router = express.Router();

router
  .route("/")
  .post(createPreBuiltPackageCustomizationEnquiry)
  .get(getAllPreBuiltPackageCustomizationEnquiries);

router
  .route("/:id")
  .get(getPreBuiltPackageCustomizationEnquiryById)
  .delete(deletePreBuiltPackageCustomizationEnquiryById);

export default router;
