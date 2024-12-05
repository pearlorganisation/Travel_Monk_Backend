import express from "express";
import {
  searchDestinations,
  toggleDestinationPopularity,
} from "../../controllers/destination/destinationController.js";
import { getVehiclesForDestination } from "../../controllers/vehicle/vehicleController.js";
import { getHotelsByDestination } from "../../controllers/hotel/hotelController.js";
import { getActivitiesByDestination } from "../../controllers/activity/activityController.js";
import { getPackagesByDestination } from "../../controllers/package/packageController.js";

const router = express.Router();

router.route("/search").get(searchDestinations); // For separate searching when customizing
router.route("/:destinationId/hotels").get(getHotelsByDestination);
router.route("/:destinationId/vehicles").get(getVehiclesForDestination); // For selectin vehicle during customization | available vehicle will get
router.route("/:destinationId/activities").get(getActivitiesByDestination);
router.route("/:destinationId/packages").get(getPackagesByDestination); // Explore leh in home page UI
router
  .route("/:destinationId/toggle-popularity")
  .patch(toggleDestinationPopularity);

export default router;
