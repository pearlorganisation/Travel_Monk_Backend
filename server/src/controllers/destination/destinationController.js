import Destinations from "../../models/destination/destinations.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const searchDestinations = asyncHandler(async (req, res, next) => {
  const { destination } = req.query;
  const limit = 10; // Set a fixed limit

  if (!destination) {
    return next(
      new ApiErrorResponse("Please provide a destination to search for", 400)
    );
  }

  let filter = { name: { $regex: new RegExp(destination, "i") } }; // Case-insensitive search

  // Fetch Indian and International destinations with the fixed limit
  const destinations = await Destinations.find(filter)
    .select("name")
    .limit(limit);

  // If no destinations are found in either collection
  if (!destinations.length) {
    return next(new ApiErrorResponse("No destinations found", 404));
  }
  const totalDestinations = await Destinations.countDocuments(filter);

  // Return the results with the fixed limit applied
  return res.status(200).json({
    success: true,
    message: "Destinations retrieved successfully",
    meta: {
      totalRecords: totalDestinations,
      limit,
    },
    data: destinations,
  });
});

export const getAllDestinations = asyncHandler(async (req, res, next) => {
  const allDestinations = await Destinations.find().select("name");

  if (allDestinations.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No Destinations found" });
  }

  res.status(200).json({
    success: true,
    message: "All Destinations found successfully",
    destinations: allDestinations,
  });
});

// Controller to toggle destination popularity
export const toggleDestinationPopularity = asyncHandler(
  async (req, res, next) => {
    const { destinationId } = req.params;

    // Check if vehicleId is provided
    if (!destinationId) {
      return next(new ApiErrorResponse("Destination ID is required", 400));
    }

    // Find the vehicle by ID
    const destination = await Destinations.findById(destinationId);
    console.log(destination);
    if (!destination) {
      return next(new ApiErrorResponse("Destination not found", 404));
    }
    console.log("des", !destination.isPopular);
    // Toggle the isAvailable field
    destination.isPopular = !destination.isPopular;

    // Save the updated vehicle
    await destination.save();

    res.status(200).json({
      success: true,
      message: `Destination popularity toggled to ${destination.isPopular}`,
      data: destination,
    });
  }
);
