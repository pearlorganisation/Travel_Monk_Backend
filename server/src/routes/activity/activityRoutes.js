import express from "express";

import {
  createActivity,
  deleteActivityById,
  getActivitiesByDestination,
  getActivityById,
  getAllActivities,
  updateActivityById,
} from "../../controllers/activity/activityController.js";

const router = express.Router();

router.route("/").post(createActivity).get(getAllActivities);

router
  .route("/:id")
  .get(getActivityById)
  .delete(deleteActivityById)
  .put(updateActivityById);

// router.route("/destination/:destinationId").get(getActivitiesByDestination);

export default router;
