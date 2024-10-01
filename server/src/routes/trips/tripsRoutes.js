import express from "express";
import {
  createIndianDestination,
  deleteIndianDestination,
  getIndianDestination,
  getSingleIndianDestination,
  updateIndianDestination,
} from "../../controllers/trips/indianDestinationsControllers.js";
import fileParser from "../../middlewares/fileParser.js";
import {
  createInternationalDestination,
  getInternationalDestination,
  getSingleInternationalDestination,
  updateInternationalDestination,
} from "../../controllers/trips/internatinalDestinationsController.js";

const router = express.Router();

router
  .route("/indian")
  .post(fileParser, createIndianDestination)
  .get(getIndianDestination);

router
  .route("/indian/:id")
  .get(getSingleIndianDestination)
  .patch(fileParser, updateIndianDestination)
  .delete(deleteIndianDestination);

router
  .route("/international")
  .post(fileParser, createInternationalDestination)
  .get(getInternationalDestination)
  .patch(updateInternationalDestination)
  .delete(deleteIndianDestination);

router.route("/international/:id").get(getSingleInternationalDestination);

export default router;
