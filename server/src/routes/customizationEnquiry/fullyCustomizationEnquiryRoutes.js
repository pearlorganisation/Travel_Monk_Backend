import express from "express";
import {
  createFullyCustomizeEnquiry,
  deleteFullyCustomizeEnquiryById,
  getAllFullyCustomizeEnquiries,
  getFullyCustomizeEnquiryById,
} from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";

const router = express.Router();

router
  .route("/")
  .post(createFullyCustomizeEnquiry)
  .get(getAllFullyCustomizeEnquiries);

router
  .route("/:id")
  .get(getFullyCustomizeEnquiryById)
  .delete(deleteFullyCustomizeEnquiryById);

export default router;
