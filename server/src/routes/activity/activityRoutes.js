import express from "express";
import {
  createIndianActivity,
  deleteIndianActivityById,
  getActivityById,
  getAllIndianActivities,
  updateIndianActivityById,
} from "../../controllers/activity/indianActivityController.js";

const router = express.Router();

router.route("/indian").post(createIndianActivity).get(getAllIndianActivities);

router
  .route("/indian/:id")
  .get(getActivityById)
  .delete(deleteIndianActivityById)
  .put(updateIndianActivityById);

export default router;
