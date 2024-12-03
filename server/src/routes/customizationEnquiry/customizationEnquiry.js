import express from "express";
import { createPreBuiltPackageCustomizationEnquiry } from "../../controllers/customizationEnquiry/customizationEnquiryController.js";

const router = express.Router();

router.route("/").post(createPreBuiltPackageCustomizationEnquiry);

export default router;
