import express from "express";
import { searchDestinations } from "../../controllers/destination/destinationController.js";

const router = express.Router();

router.route("/search").post(searchDestinations);

export default router;
