import express from "express";
import {
  createFullyCustomizeEnquiry,
  getAllEnquiries,
} from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";

const router = express.Router();

router.route("/").post(createFullyCustomizeEnquiry).get(getAllEnquiries);

export default router;
