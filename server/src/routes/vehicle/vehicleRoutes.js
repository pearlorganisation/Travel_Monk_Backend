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
    createVehicle
  )
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllVehicles
  );
router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getVehicleById
  )
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updateVehicleById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteVehicleById
  );
router
  .route("/:vehicleId/toggle-availability")
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    toggleVehicleAvailability
  );

export default router;
