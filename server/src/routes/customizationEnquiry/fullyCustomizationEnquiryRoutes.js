import express from "express";
import {
  createFullyCustomizeEnquiry,
  deleteFullyCustomizeEnquiryById,
  getAllFullyCustomizeEnquiries,
  getFullyCustomizeEnquiryById,
  getMyFullyCustomizeEnquiries,
} from "../../controllers/customizationEnquiry/fullyCustomizationEnquiryController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { UserRolesEnum } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, createFullyCustomizeEnquiry)
  .get(
    authenticateToken,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllFullyCustomizeEnquiries
  );

router
  .route("/my-enquiries")
  .get(authenticateToken, getMyFullyCustomizeEnquiries);

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
