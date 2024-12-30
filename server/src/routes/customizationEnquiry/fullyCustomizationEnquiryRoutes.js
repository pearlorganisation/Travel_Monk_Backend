import express from "express";
import {
  createFullyCustomizeEnquiry,
  deleteFullyCustomizeEnquiryById,
  getAllFullyCustomizeEnquiries,
  getFullyCustomizeEnquiryById,
} from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(createFullyCustomizeEnquiry)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllFullyCustomizeEnquiries
  );

router
  .route("/:id")
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getFullyCustomizeEnquiryById
  )
  .delete(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteFullyCustomizeEnquiryById
  );

export default router;
