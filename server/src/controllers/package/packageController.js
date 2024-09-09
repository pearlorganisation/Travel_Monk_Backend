import Package from "../../models/package/package.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createPackage = asyncHandler(async (req, res, next) => {
  const {
    name,
    duration,
    itinerary,
    pricing,
    inclusions,
    exclusions,
    premiumAddons,
  } = req.body;

  if (!name || !duration) {
    return next(
      new ApiErrorResponse("Please provide all required fields", 400)
    );
  }

  const newPackage = new Package({
    name,
    duration,
    itinerary,
    pricing,
    inclusions,
    exclusions,
    premiumAddons,
  });
  await newPackage.save();

  return res
    .status(201)
    .json({ success: true, message: "Package is created", data: newPackage });
});
