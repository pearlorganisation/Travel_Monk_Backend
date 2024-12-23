import Destination from "../../models/destination/destinations.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import Location from "../../models/location/location.js";

// Can create multiple locations for a single destination
export const createLocations = asyncHandler(async (req, res, next) => {
  const { destinationId } = req.params;
  const existingDestination = await Destination.findById(destinationId);

  if (!existingDestination) {
    return next(new ApiErrorResponse("Destination not found", 404));
  }

  let { locations } = req.body; // Array of locations with day and location details

  if (!Array.isArray(locations)) {
    // If location is not an array handel it
    locations = [locations];
  }

  // Transform and validate each location group
  const locationData = locations.map(({ day, location }) => {
    if (!day || !Array.isArray(location) || location.length === 0) {
      // location must be array
      return next(
        new ApiErrorResponse(
          "Each location group must include a 'day' and an array of 'location' details.",
          400
        )
      );
    }

    const transformedLocations = location.map((loc) => {
      if (!loc.name || !loc.latitude || !loc.longitude) {
        return next(
          new ApiErrorResponse(
            "Invalid location data. Ensure 'name', 'latitude', and 'longitude' are provided for each location.",
            400
          )
        );
      }

      return {
        name: loc.name,
        coordinates: {
          type: "Point",
          coordinates: [loc.longitude, loc.latitude],
        },
      };
    });

    return { day, location: transformedLocations, destination: destinationId };
  });

  // Insert all location groups in one go
  const newLocations = await Location.insertMany(locationData);

  if (!newLocations || newLocations.length === 0) {
    return next(new ApiErrorResponse("Locations were not created", 400));
  }

  // Respond with the saved locations
  return res.status(201).json({
    success: true,
    message: "Locations are created",
    data: newLocations,
  });
});

export const getAllLocationsForDestination = asyncHandler(
  async (req, res, next) => {
    const { destinationId } = req.params;
    const locations = await Location.find({ destination: destinationId });

    if (!locations || locations.length === 0) {
      return next(new ApiErrorResponse("No locations found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Locations are fetched",
      data: locations,
    });
  }
);