import express from "express";
import {
  createVehicle,
  deleteVehicleById,
  getAllVehicles,
  getVehicleById,
} from "../../controllers/vehicle/vehicleController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createVehicle).get(getAllVehicles);
router.route("/:id").get(getVehicleById).delete(deleteVehicleById);

export default router;
