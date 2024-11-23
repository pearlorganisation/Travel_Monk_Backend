import express from "express";
import { createVehicle } from "../../controllers/vehicle/vehicleController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createVehicle);

export default router;
