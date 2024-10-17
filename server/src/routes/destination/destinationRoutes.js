import express from "express";
import { searchDestinations } from "../../controllers/destination/destinationController.js";

const router = express.Router();

router.route("/search").get(searchDestinations);

export default router;
