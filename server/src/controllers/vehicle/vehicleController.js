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
