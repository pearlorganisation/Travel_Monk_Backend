import express from "express";
import { submitContactForm } from "../../controllers/contact/contactController.js";
import {
  createBusCruiseContact,
  getAllBusCruiseContacts,
  getBusCruiseContactById,
  updateBusCruiseContact,
  deleteBusCruiseContact,
} from "../../controllers/busCruiseContact/busCruiseContactController.js";

const router = express.Router();

router.route("/").post(submitContactForm);
router
  .route("/bus-cruise")
  .post(createBusCruiseContact)
  .get(getAllBusCruiseContacts);
router
  .route("/bus-cruise/:id")
  .get(getBusCruiseContactById)
  .put(updateBusCruiseContact)
  .delete(deleteBusCruiseContact);

export default router;
