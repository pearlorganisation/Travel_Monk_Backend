import express from "express";
import { createPackage } from "../../controllers/package/packageController.js";

const router = express.Router();

router.route("/").post(createPackage);

export default router;
