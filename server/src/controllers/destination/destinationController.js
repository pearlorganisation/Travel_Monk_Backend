import IndianDestinations from "../../models/trip/indian_destinations.js";
import InternationalDestinations from "../../models/trip/international_destinations.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const searchDestinations = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const limit = 10; // Set a fixed limit

  if (!name) {
    return next(
      new ApiErrorResponse("Please provide a name to search for", 400)
    );
  }

  let filter = { name: { $regex: new RegExp(name, "i") } }; // Case-insensitive search

  // Fetch Indian and International destinations (up to half of the total limit from each)
  const indianLimit = Math.ceil(limit / 2); // Half of the total limit
  const internationalLimit = limit - indianLimit; // Ensure the total is exactly 10

  // Fetch Indian and International destinations with the fixed limit
  const indianDestinations = await IndianDestinations.find(filter).limit(
    indianLimit
  );
  const internationalDestinations = await InternationalDestinations.find(
    filter
  ).limit(internationalLimit);

  // If no destinations are found in either collection
  if (!indianDestinations.length && !internationalDestinations.length) {
    return next(new ApiErrorResponse("No destinations found", 404));
  }

  // Combine both Indian and International results
  const combinedResults = {
    indianDestinations,
    internationalDestinations,
  };

  const totalIndian = await IndianDestinations.countDocuments(filter);
  const totalInternational = await InternationalDestinations.countDocuments(
    filter
  );
  const total = totalIndian + totalInternational;

  // Return the results with the fixed limit applied
  return res.status(200).json({
    success: true,
    message: "Destinations retrieved successfully",
    meta: {
      totalRecords: total,
      limit,
    },
    data: combinedResults,
  });
});