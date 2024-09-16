import express from "express";
import { createIndianDestination } from "../../controllers/trips/indianDestinationsControllers.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/indian").post(fileParser, createIndianDestination);

export default router;
