import express from "express";
import {
  createIndianActivity,
  getActivityById,
  getAllIndianActivities,
} from "../../controllers/activity/indianActivityController.js";

const router = express.Router();

router.route("/indian").post(createIndianActivity).get(getAllIndianActivities);

router.route("/indian/:id").get(getActivityById);
export default router;
