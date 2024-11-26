import Vehicle from "../../models/Vehicle/Vehicle.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createVehicle = asyncHandler(async (req, res, next) => {
  const { images } = req.files; // If no files the we wil get {], and images will be undefined
  const vehicleData = req.body;

  // Upload vehicle images
  const uploadedImages = images ? await uploadFileToCloudinary(images) : [];

  // Prepare vehicle data
  const newVehicleData = {
    ...vehicleData,
    images: uploadedImages,
  };

  // Save vehicle to database
  const newVehicle = await Vehicle.create(newVehicleData);
  if (!newVehicle) {
    return next(new ApiErrorResponse("Vehicle creation failed", 400));
  }

  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    data: newVehicle,
  });
});

export const getVehiclesForDestination = asyncHandler(
  async (req, res, next) => {
    const { destinationId } = req.params;

    // Find vehicles that are linked to the specified destination
    const vehicles = await Vehicle.find({ destinations: destinationId }); //Will check directly in array for single value

    if (!vehicles || vehicles.length === 0) {
      return next(
        new ApiErrorResponse("No vehicles found for this destination", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles for the destination fetched successfully",
      data: vehicles,
    });
  }
);
