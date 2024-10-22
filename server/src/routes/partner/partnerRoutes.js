import express from "express";
import {
  createPartner,
  deletePartnerById,
  getAllPartners,
  getPartnerById,
  updatePartnerById,
} from "../../controllers/partner/partnerController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createPartner).get(getAllPartners);
router
  .route("/:id")
  .get(getPartnerById)
  .put(fileParser, updatePartnerById)
  .delete(deletePartnerById);

export default router;
