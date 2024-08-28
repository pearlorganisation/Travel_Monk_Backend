import express from "express";
import { createHotels } from "../../controllers/hotel/hotelController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    createHotels
  );

export default router;
