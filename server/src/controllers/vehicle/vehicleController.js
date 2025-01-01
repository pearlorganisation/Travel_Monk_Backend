import Vehicle from "../../models/Vehicle/Vehicle.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { deleteFile } from "../../utils/fileUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller to create a vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  try {
    const {
      vehicleName,
      passengerCapacity,
      luggageCapacity,
      pricePerDay,
      destinations,
    } = req.body;

    const files = req.files?.image;
    console.log("Files: ", files);
    if (!files || files.length === 0) {
      res.status(400);
      throw new Error("Image file is required.");
    }

    // Process the first uploaded file
    const file = files[0];
    const publicPath = path.join("uploads", file.newFilename); // Relative path for saving
    const targetPath = path.join(__dirname, "../../../public", publicPath); // Full path in server directory
    console.log("Public path: ", publicPath);
    console.log("Target path: ", targetPath); // D:\Travel Monk Backend\server\public\uploads\41939a5f1ce07d50d7bed5e00.jpg

    // Move the file to the uploads directory if not already there
    if (!fs.existsSync(targetPath)) {
      console.log("File moved successfully.");
      fs.renameSync(file.filepath, targetPath);
    }

    // Create the vehicle entry in the database
    const vehicle = await Vehicle.create({
      vehicleName,
      passengerCapacity: Number(passengerCapacity),
      luggageCapacity: Number(luggageCapacity),
      pricePerDay: Number(pricePerDay),
      destinations: Array.isArray(destinations) ? destinations : [destinations],
      image: {
        filename: file.newFilename,
        path: publicPath, // Save relative path to the database
      },
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully!",
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
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
  const { image } = req.files;

  // Fetch the university to check for existing images
  const existingVehicle = await Vehicle.findById(req.params.id);
  if (!existingVehicle) {
    return next(new ApiError("Vehicle not found", 404));
  }
  let uploadedImage;

  // Only upload images if they are provided
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    const targetPath = path.join(
      __dirname,
      "../../../public/" + uploadedImage.path
    );
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }
    fs.renameSync(image[0].filepath, targetPath);
    if (existingVehicle.image) {
      // Delete the existing image from the server
      const filePath = path.join(
        __dirname,
        "../../../public",
        existingVehicle.image.path
      );
      await deleteFile(filePath);
    }
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      image: uploadedImage,
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

  // Delete the single image file from the local filesystem
  if (deletedVehicle.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../../public",
        deletedVehicle.image.path
      ); // Absolute path

      console.log(filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Unlink (delete) the file
        console.log(`Deleted image: ${filePath}`);
      }
    } catch (error) {
      console.error("Error deleting image file:", error);
      return next(
        new ApiErrorResponse("Error deleting vehicle image from server", 500)
      );
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

// Controller to toggle vehicle availability
export const toggleVehicleAvailability = asyncHandler(
  async (req, res, next) => {
    const { vehicleId } = req.params;

    // Check if vehicleId is provided
    if (!vehicleId) {
      return next(new ApiErrorResponse("Vehicle ID is required", 400));
    }

    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return next(new ApiErrorResponse("Vehicle not found", 404));
    }

    // Toggle the isAvailable field
    vehicle.isAvailable = !vehicle.isAvailable;

    // Save the updated vehicle
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: `Vehicle availability toggled to ${vehicle.isAvailable}`,
      data: vehicle,
    });
  }
);
