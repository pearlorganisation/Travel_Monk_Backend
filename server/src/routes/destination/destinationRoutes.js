import express from "express";
import { searchDestinations } from "../../controllers/destination/destinationController.js";
import { getVehiclesForDestination } from "../../controllers/vehicle/vehicleController.js";

const router = express.Router();

router.route("/search").get(searchDestinations); // For separate searching 
router.route("/:destinationId/vehicles").get(getVehiclesForDestination); // For selectin vehicle during customization

export default router;
