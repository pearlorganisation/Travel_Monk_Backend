import express from "express";
import {
  createPartner,
  deletePartnerById,
  getAllPartners,
  getPartnerById,
  updatePartnerById,
} from "../../controllers/partner/partnerController.js";
import fileParser from "../../middlewares/fileParser.js";
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
    fileParser,
    createPartner
  )
  .get(getAllPartners);
router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getPartnerById
  )
  .put(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    fileParser,
    updatePartnerById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deletePartnerById
  );

export default router;
