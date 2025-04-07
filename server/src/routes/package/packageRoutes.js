import express from "express";
import {
  createPackage,
  deletePackageById,
  getAllBestsellerPackages,
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

router.route("/best-seller").get(getAllBestsellerPackages); // For getting best seller packages in home page

router
  .route("/:packageId")
  .get(getPackageById)
  .patch(
    // authenticateToken,
    // verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updatePackageById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePackageById
  );

export default router;
