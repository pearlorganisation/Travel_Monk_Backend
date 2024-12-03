import express from "express";
import {
  createVehicle,
  deleteVehicleById,
  getAllVehicles,
  getVehicleById,
  toggleVehicleAvailability,
  updateVehicleById,
} from "../../controllers/vehicle/vehicleController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createVehicle).get(getAllVehicles);
router
  .route("/:id")
  .get(getVehicleById)
  .patch(fileParser, updateVehicleById)
  .delete(deleteVehicleById);
router
  .route("/:vehicleId/toggle-availability")
  .patch(toggleVehicleAvailability);

export default router;
