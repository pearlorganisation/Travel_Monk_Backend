import express from "express";
import { searchDestinations } from "../../controllers/destination/destinationController.js";
import { getVehiclesForDestination } from "../../controllers/vehicle/vehicleController.js";
import { getHotelsByDestination } from "../../controllers/hotel/hotelController.js";
import { getActivitiesByDestination } from "../../controllers/activity/activityController.js";

const router = express.Router();

router.route("/search").get(searchDestinations); // For separate searching
router.route("/:destinationId/hotels").get(getHotelsByDestination);
router.route("/:destinationId/vehicles").get(getVehiclesForDestination); // For selectin vehicle during customization | available vehicle will get
router.route("/:destinationId/activities").get(getActivitiesByDestination);
export default router;
