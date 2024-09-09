import express from "express";
import { createItinerary } from "../../controllers/itinerary/itineraryController.js";

const router = express.Router();

router.route("/").post(createItinerary);

export default router;
