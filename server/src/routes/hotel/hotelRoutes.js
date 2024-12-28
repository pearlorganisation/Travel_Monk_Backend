import express from "express";
import {
  createHotel,
  deleteHotelById,
  getAllHotels,
  getHotelById,
} from "../../controllers/hotel/hotelController.js";
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
    // authenticateToken,
    // verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    createHotel // Only(admin)
  )
  .get(getAllHotels);

router.route("/:hotelId").get(getHotelById).delete(deleteHotelById);

export default router;
