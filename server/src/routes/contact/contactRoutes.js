import express from "express";
import {
  deleteContactById,
  getAllContacts,
  submitContactForm,
} from "../../controllers/contact/contactController.js";
import {
  createBusCruiseContact,
  getAllBusCruiseContacts,
  getBusCruiseContactById,
  updateBusCruiseContact,
  deleteBusCruiseContact,
} from "../../controllers/busCruiseContact/busCruiseContactController.js";
import {
  createHotelContact,
  deleteHotelContact,
  getAllHotelContacts,
  getHotelContactById,
} from "../../controllers/hotelContact/hotelContactController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(submitContactForm)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllContacts
  );
router
  .route("/:id")
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteContactById
  );

router
  .route("/bus-cruise")
  .post(createBusCruiseContact)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllBusCruiseContacts
  );
router
  .route("/bus-cruise/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getBusCruiseContactById
  )
  .put(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateBusCruiseContact
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteBusCruiseContact
  );

router
  .route("/hotel")
  .post(createHotelContact)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllHotelContacts
  );
router
  .route("/hotel/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getHotelContactById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteHotelContact
  );

export default router;
