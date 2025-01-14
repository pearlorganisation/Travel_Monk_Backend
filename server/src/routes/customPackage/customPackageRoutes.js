import express from "express";
import { createCustomPackage } from "../../controllers/customPackage/customPackageController.js";

const router = express.Router();

router.route("/").post(createCustomPackage);

export default router;
