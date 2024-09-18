import express from "express";
import { submitContactForm } from "../../controllers/contact/contactController.js";

const router = express.Router();

router.route("/").post(submitContactForm);

export default router;
