import Hotel from "../../models/hotel/hotel.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createHotels = asyncHandler(async (req, res, next) => {
  const hotel = req.body;
});
