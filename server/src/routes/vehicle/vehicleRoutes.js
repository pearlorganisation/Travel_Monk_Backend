import express from "express";
import {
  createVehicle,
  deleteVehicleById,
  getAllVehicles,
  getVehicleById,
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

export default router;
