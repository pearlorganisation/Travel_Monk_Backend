import express from "express";
import {
  createHotel,
  deleteHotelById,
  getAllHotels,
  getHotelById,
  updateHotelById,
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
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    createHotel // Only(admin)
  )
  .get(getAllHotels); // pagination, For Admin // authetcation is not required as this api also being used in web home page

router
  .route("/:hotelId")
  .get(authenticateToken, verifyPermission([UserRolesEnum.ADMIN]), getHotelById)
  .patch(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updateHotelById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteHotelById
  );

export default router;
