import express from "express";
import { createIndianDestination } from "../../controllers/trips/indianDestinationsControllers.js";

const router = express.Router();

router.route("/indian").post(createIndianDestination);

export default router;
