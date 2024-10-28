import express from "express";
import {
  getAllDestinations,
  searchDestinations,
} from "../../controllers/destination/destinationController.js";

const router = express.Router();

router.route("/search").get(searchDestinations);
router.route("/").get(getAllDestinations);

export default router;
