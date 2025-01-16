import express from "express";
import {
  createDestination,
  deleteDestination,
  getAllDestination,
  getPopularDestinations,
  getSingleDestination,
  searchDestinations,
  toggleDestinationPopularity,
  updateDestination,
} from "../../controllers/destination/destinationController.js";
import { getVehiclesForDestination } from "../../controllers/vehicle/vehicleController.js";
import { getHotelsByDestination } from "../../controllers/hotel/hotelController.js";
import { getActivitiesByDestination } from "../../controllers/activity/activityController.js";
import { getPackagesByDestination } from "../../controllers/package/packageController.js";
import fileParser from "../../middlewares/fileParser.js";
import {
  createLocations,
  deleteLocationById,
  getAllLocations,
  getAllLocationsForDestination,
  updateLocationById,
} from "../../controllers/location/locationController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    createDestination
  )
  .get(getAllDestination); // query => type and fields,
router.route("/search").get(searchDestinations); // For separate searching of destinations when customizing
router.route("/popular").get(getPopularDestinations); // For getting popular destinations in home page
router
  .route("/locations")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllLocations
  ); // Admin panel for managing locations

router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getSingleDestination
  )
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updateDestination
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteDestination
  );

router.route("/:destinationId/hotels").get(getHotelsByDestination); // For selecting hotel during customization
router.route("/:destinationId/vehicles").get(getVehiclesForDestination); //For selectin vehicle during customization|available vehicle will get
router.route("/:destinationId/activities").get(getActivitiesByDestination);
router.route("/:destinationId/packages").get(getPackagesByDestination); // Explore leh in home page UI to navigate
router
  .route("/:destinationId/toggle-popularity")
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    toggleDestinationPopularity
  );

router
  .route("/:destinationId/locations")
  .post(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    createLocations
  )
  .get(getAllLocationsForDestination); // when fully customizing

router
  .route("/locations/:locationId")
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateLocationById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteLocationById
  );

export default router;
