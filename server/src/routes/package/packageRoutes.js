import express from "express";
import {
  createPackage,
  deletePackageById,
  getPackageById,
  updatePackageById,
} from "../../controllers/package/packageController.js";

const router = express.Router();

router.route("/").post(createPackage);
router
  .route("/:packageId")
  .get(getPackageById)
  .patch(updatePackageById)
  .delete(deletePackageById);

export default router;
