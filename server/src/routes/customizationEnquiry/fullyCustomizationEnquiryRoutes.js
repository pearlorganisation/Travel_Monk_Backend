import express from "express";
import { createFullyCustomizeEnquiry } from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";

const router = express.Router();

router.route("/").post(createFullyCustomizeEnquiry);

export default router;
