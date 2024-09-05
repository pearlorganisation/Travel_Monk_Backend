import express from "express";
import {
  createHotels,
  createRoomTypes,
  deleteHotelById,
  deleteRoomTypeById,
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

router.route("/").post(
  authenticateToken,
  verifyPermission([UserRolesEnum.ADMIN]),
  fileParser,
  createHotels // Only(admin)
);

router.route("/search").get(searchHotels);

router
  .route("/:hotelId")
  .get(getHotelById)
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteHotelById // Only(admin)
  );

router.route("/:hotelId/room-types").post(fileParser, createRoomTypes);
router.route("/:hotelId/room-types/:roomTypeId").delete(deleteRoomTypeById);

export default router;
