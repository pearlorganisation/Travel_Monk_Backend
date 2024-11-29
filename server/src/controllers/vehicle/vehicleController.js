import Vehicle from "../../models/Vehicle/Vehicle.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

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
  const page = parseInt(req.query.page || "1"); // Default to page 1
  const limit = parseInt(req.query.limit || "10"); // Default to 10 items per page

  // Use the pagination utility function
  const { data: vehicles, pagination } = await paginate(Vehicle, page, limit);

  // Check if no vehicles are found
  if (!vehicles || vehicles.length === 0) {
    return next(new ApiErrorResponse("No vehicles found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All vehicles retrieved successfully",
    data: vehicles,
    pagination,
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
  const { images } = req.files;

  // Fetch the university to check for existing images
  const existingVehicle = await Vehicle.findById(req.params.id);
  if (!existingVehicle) {
    return next(new ApiError("Vehicle not found", 404));
  }
  let uploadedImagesResponse;

  // Only upload images if they are provided
  if (images) {
    uploadedImagesResponse = await uploadFileToCloudinary(images); // Assuming this function exists
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      images: uploadedImagesResponse,
    },
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

  // Delete images from Cloudinary
  if (
    Array.isArray(deletedVehicle.images) &&
    deletedVehicle.images.length > 0
  ) {
    try {
      const deleteResponse = await deleteFileFromCloudinary(
        deletedVehicle.images
      );
      console.log(deleteResponse);
      if (!deleteResponse.success) {
        console.error(
          "Failed to delete some images:",
          deleteResponse.failedDeletes
        );
        // Optionally, include partial failure information in the API response
        return res.status(200).json({
          success: true,
          message: "Vehicle deleted, but some images failed to delete",
          failedImages: deleteResponse.failedDeletes,
        });
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
      return next(new ApiErrorResponse("Error deleting vehicle images", 500));
    }
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
    const vehicles = await Vehicle.find({
      destinations: destinationId,
      isAvailable: true,
    }); //Will check directly in array for single value

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
