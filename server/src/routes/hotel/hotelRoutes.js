import express from "express";
import {
  createHotels,
  deleteHotelById,
  getHotelById,
  searchHotels,
} from "../../controllers/hotel/hotelController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/search").get(searchHotels);

router.route("/").post(
  authenticateToken,
  verifyPermission([UserRolesEnum.ADMIN]),
  fileParser,
  createHotels // Only(admin)
);

router
  .route("/:id")
  .get(getHotelById)
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteHotelById // Only(admin)
  );

export default router;
