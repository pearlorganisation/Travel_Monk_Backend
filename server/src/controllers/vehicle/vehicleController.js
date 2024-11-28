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

export const getAllVehicles = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find();
  if (!vehicles || vehicles.length === 0) {
    return next(new ApiErrorResponse("No vehicles found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "All vehicles retrieved successfully",
    data: vehicles,
  });
});

export const getVehicleById = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return next(new ApiErrorResponse("Vehicle not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Vehicle retrieved successfully",
    data: vehicle,
  });
});


export const updateVehicleById = asyncHandler(async (req, res, next) => {
  const { images } = req.files || {};
  let uploadedImages;

  // Only upload images if they are provided
  if (images) {
    uploadedImages = await uploadFileToCloudinary(images); // Assuming this function exists
  }

  // Prepare the update object
  const updateData = {
    ...req.body,
  };

  // Include new images if uploaded
  if (uploadedImages) {
    updateData.images = uploadedImages;
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedVehicle) {
    return next(new ApiErrorResponse("Vehicle not found or not updated", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    data: updatedVehicle,
  });
});

export const deleteVehicleById = asyncHandler(async (req, res, next) => {
  const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!deletedVehicle) {
    return next(new ApiErrorResponse("Vehicle not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
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
