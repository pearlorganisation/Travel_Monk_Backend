import express from "express";

import {
  createActivity,
  deleteActivityById,
  getActivitiesByDestination,
  getActivityById,
  getAllActivities,
  updateActivityById,
} from "../../controllers/activity/activityController.js";
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
    createActivity
  )
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllActivities
  );

router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getActivityById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteActivityById
  )
  .put(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateActivityById
  );

// router.route("/destination/:destinationId").get(getActivitiesByDestination);

export default router;
