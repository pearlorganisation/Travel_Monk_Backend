import express from "express";
import {
  createPartnerType,
  deletePartnerType,
  getAllPartnerTypes,
  getPartnerTypeById,
  updatePartnerType,
} from "../../controllers/partnerTypes/partnerTypesController.js";
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
    createPartnerType
  )
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllPartnerTypes
  );
router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getPartnerTypeById
  )
  .put(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    updatePartnerType
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePartnerType
  );

export default router;
