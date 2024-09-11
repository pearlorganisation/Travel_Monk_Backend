import express from "express";
import {
  createPackage,
  deletePackageById,
  getAllPackages,
  getPackageById,
  updatePackageById,
} from "../../controllers/package/packageController.js";

const router = express.Router();

router.route("/").post(createPackage).get(getAllPackages);

router
  .route("/:packageId")
  .get(getPackageById)
  .patch(updatePackageById)
  .delete(deletePackageById);

export default router;
