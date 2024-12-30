import express from "express";
import {
  createPackage,
  deletePackageById,
  getAllPackages,
  getPackageById,
  updatePackageById,
} from "../../controllers/package/packageController.js";
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
    createPackage
  )
  .get(getAllPackages); // admin or main web?

router
  .route("/:packageId")
  .get(getPackageById)
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updatePackageById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePackageById
  );

export default router;
