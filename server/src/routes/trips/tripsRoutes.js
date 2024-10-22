import express from "express";
import fileParser from "../../middlewares/fileParser.js";
import {
  createDestination,
  deleteDestination,
  getDestination,
  getSingleDestination,
  updateDestination,
} from "../../controllers/trips/destinationsController.js";

const router = express.Router();

router
  .route("/destination")
  .post(fileParser, createDestination)
  .get(getDestination);

router
  .route("/destination/:id")
  .get(getSingleDestination)
  .patch(fileParser, updateDestination)
  .delete(deleteDestination);

export default router;
