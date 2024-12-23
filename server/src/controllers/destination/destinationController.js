import Destination from "../../models/destination/destinations.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteFile } from "../../utils/fileUtils.js";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createDestination = asyncHandler(async (req, res, next) => {
  const { image, banner } = req.files;

  let uploadedImage = null;
  let uploadedBanner = null;

  // Save image locally
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    const targetPath = path.join(
      __dirname,
      "../../../public/",
      uploadedImage.path
    );

    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    // Move the file to the target path
    fs.renameSync(image[0].filepath, targetPath);
  }

  // Save banner locally
  if (banner) {
    uploadedBanner = {
      filename: banner[0].newFilename,
      path: `uploads/${banner[0].newFilename}`,
    };
    const targetPath = path.join(
      __dirname,
      "../../../public/",
      uploadedBanner.path
    );

    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    // Move the file to the target path
    fs.renameSync(banner[0].filepath, targetPath);
  }

  // Create destination with uploaded files
  const newDestination = await Destination.create({
    ...req.body,
    image: uploadedImage,
    banner: uploadedBanner,
  });

  return res.status(201).json({
    success: true,
    message: "Destination is created",
    data: newDestination,
  });
});

export const getAllDestination = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Get fields to include from query parameters
  const fields = req.query.fields || ""; // Defaults to an empty string if not provided, undefined when "" not provided, fields=name,banner,startingPrice etc
  const filter = {};
  if (req.query.type) {
    filter.type = { $regex: new RegExp(req.query.type, "i") };
  }
  const { data: destinations, pagination } = await paginate(
    Destination,
    page,
    limit,
    [], // No populate options for now
    filter, // Filter by type if provided
    fields // Pass the fields dynamically
  );

  if (!destinations || destinations.length === 0) {
    return res.status(404).json({ message: "No Destinations Found" });
  }

  res.status(200).json({
    success: true,
    message: "Destinations fetched successfully",
    pagination,
    data: destinations,
  });
});

export const getSingleDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const findDestionation = await Destination.findById(id);

  if (findDestionation == null) {
    return res.status(404).json({ message: "No Destination ith ID found" });
  }

  res.status(200).json({
    success: true,
    message: "Destionation found successfully",
    data: findDestionation,
  });
});

export const updateDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, startingPrice, packages, hotels, locations, type } = req.body;
  const { image, banner } = req.files;

  // Find the Indian Destination by ID
  const destination = await Destination.findById(id);
  if (!destination) {
    return next(new ApiErrorResponse("Indian destination not found", 404));
  }

  // Upload new image and banner files if provided
  let uploadedImage = [];
  let uploadedBanner = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image);
    destination.image = uploadedImage[0];
  }
  if (banner) {
    uploadedBanner = await uploadFileToCloudinary(banner);
    destination.banner = uploadedBanner[0];
  }

  // Update fields if provided in the request body
  if (name) destination.name = name;
  if (startingPrice) destination.startingPrice = startingPrice;
  if (type) destination.type = type;

  // Handle Packages - only add new packages, don't overwrite existing ones
  if (packages && Array.isArray(packages)) {
    const existingPackages = destination.packages.map((pkg) => pkg.toString());
    const newPackages = packages.filter(
      (pkg) => !existingPackages.includes(pkg)
    );
    destination.packages.push(...newPackages);
  }

  // Handle Hotels
  if (hotels && Array.isArray(hotels)) {
    const existingHotels = destination.hotels.map((hotel) => hotel.toString());
    const newHotels = hotels.filter((hotel) => !existingHotels.includes(hotel));
    destination.hotels.push(...newHotels);
  }

  // Handel locations
  if (locations && Array.isArray(locations)) {
    const existingLocations = destination.locations.map((location) =>
      location.toString()
    );
    const newLocations = locations.filter(
      (location) => !existingLocations.includes(location)
    );
    destination.locations.push(...newLocations);
  }

  // Save the updated Indian Destination
  await destination.save();

  res.status(200).json({
    success: true,
    message: "Destination updated successfully",
    data: destination,
  });
});

export const deleteDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleteDestination = await Destination.findByIdAndDelete(id);

  if (deleteDestination == null) {
    return res.status(404).json({ message: "No Destination with ID found" });
  }

  // Delete the banner file from the server
  if (deleteDestination.banner) {
    const bannerPath = path.join(
      __dirname,
      "../../../public",
      deleteDestination.banner.path
    );
    try {
      await deleteFile(bannerPath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting destination banner:", error);
      return next(
        new ApiErrorResponse(
          "Error deleting destination banner from server",
          500
        )
      );
    }
  }

  // Delete the image file from the server
  if (deleteDestination.image) {
    const imagePath = path.join(
      __dirname,
      "../../../public",
      deleteDestination.image.path
    );
    try {
      await deleteFile(imagePath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting destination image:", error);
      return next(
        new ApiErrorResponse(
          "Error deleting destination image from server",
          500
        )
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Destionation deleted successfully",
  });
});

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
  const destinations = await Destination.find(filter)
    .select("name")
    .limit(limit);

  // Return an empty array with a 200 OK status when no results are found for searching
  if (!destinations.length) {
    return res.status(200).json({
      success: true,
      message: "No destinations found",
      data: [],
    });
  }

  const totalDestinations = await Destination.countDocuments(filter);

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

export const getPopularDestinations = asyncHandler(async (req, res, next) => {
  const popularDestinations = await Destination.find({ isPopular: true });

  if (!popularDestinations || popularDestinations.length === 0) {
    return next(new ApiErrorResponse("No popular destinations found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Popular destinations retrieved successfully",
    data: popularDestinations,
  });
});

export const getAllDestinations = asyncHandler(async (req, res, next) => {
  const allDestinations = await Destination.find().select("name");

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

export const toggleDestinationPopularity = asyncHandler(
  async (req, res, next) => {
    const { destinationId } = req.params;

    // Check if vehicleId is provided
    if (!destinationId) {
      return next(new ApiErrorResponse("Destination ID is required", 400));
    }

    // Find the vehicle by ID
    const destination = await Destination.findById(destinationId);
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
