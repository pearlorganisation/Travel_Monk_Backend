import express from "express";
import {
  createPartner,
  deletePartnerById,
  getAllPartners,
  getPartnerById,
  updatePartnerById,
} from "../../controllers/partner/partnerController.js";

const router = express.Router();

router.route("/").post(createPartner).get(getAllPartners);
router
  .route("/:id")
  .get(getPartnerById)
  .put(updatePartnerById)
  .delete(deletePartnerById);

export default router;
