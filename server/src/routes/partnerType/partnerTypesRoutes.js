import express from "express";
import {
  createPartnerType,
  deletePartnerType,
  getAllPartnerTypes,
  getPartnerTypeById,
  updatePartnerType,
} from "../../controllers/partnerTypes/partnerTypesController.js";

const router = express.Router();

router.route("/").post(createPartnerType).get(getAllPartnerTypes);
router
  .route("/:id")
  .get(getPartnerTypeById)
  .put(updatePartnerType)
  .delete(deletePartnerType);

export default router;
