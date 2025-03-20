import Destination from "../../models/destination/destinations.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import Location from "../../models/location/location.js";
import { paginate } from "../../utils/pagination.js";

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
    const { location } = req.query;
    const locations = await Location.find({
      destination: destinationId,
      location,
    }).sort({ day: 1 });

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

export const updateLocationById = asyncHandler(async (req, res, next) => {
  const { locationId } = req.params;
  const { day, location } = req.body;

  // Validate day and location fields
  if (!day || !location) {
    return next(
      new ApiErrorResponse(
        "Invalid location data. Ensure 'day' and 'location' are provided.",
        400
      )
    );
  }

  const transformedLocations = [];
  //This ensures that if a validation error occurs, it immediately exits the loop and prevents further processing. Do not use map() here
  for (const loc of location) {
    if (!loc.name || !loc.latitude || !loc.longitude) {
      return next(
        new ApiErrorResponse(
          "Invalid location data. Ensure 'name', 'latitude', and 'longitude' are provided for each location.",
          400
        )
      );
    }

    transformedLocations.push({
      name: loc.name,
      coordinates: {
        type: "Point",
        coordinates: [loc.latitude, loc.longitude],
      },
    });
  }

  // Update the location in the database
  const updatedLocation = await Location.findByIdAndUpdate(
    locationId,
    { day, location: transformedLocations },
    { new: true, runValidators: true }
  );

  if (!updatedLocation) {
    return next(new ApiErrorResponse("Location not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Location is updated",
    data: updatedLocation,
  });
});

export const deleteLocationById = asyncHandler(async (req, res, next) => {
  const { locationId } = req.params;

  const deletedLocation = await Location.findByIdAndDelete(locationId);

  if (!deletedLocation) {
    return next(new ApiErrorResponse("Location not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Location is deleted",
  });
});

// add filter or more
export const getAllLocations = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const { data: locations, pagination } = await paginate(
    Location,
    page,
    limit,
    [{ path: "destination" }]
  );

  if (locations.length === 0) {
    return next(new ApiErrorResponse("No Locations Found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Locations Found Successfully",
    pagination,
    data: locations,
  });
});
