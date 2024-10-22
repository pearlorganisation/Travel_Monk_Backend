import Destinations from "../../models/trip/destinations.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createDestination = asyncHandler(async (req, res, next) => {
  const { name, startingPrice, packages, hotels, locations, type } = req.body;
  const { image, banner } = req.files;
  let uploadedImage = [];
  let uploadedBanner = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image);
  }

  if (banner) {
    uploadedBanner = await uploadFileToCloudinary(banner);
  }
  const newDestination = new Destinations({
    name,
    startingPrice,
    image: uploadedImage[0],
    banner: uploadedBanner[0],
    packages,
    type,
    hotels,
    locations,
  });
  await newDestination.save();

  res.status(201).json({
    success: true,
    message: "Destination created successfully!",
    data: newDestination,
  });
});

export const getDestination = asyncHandler(async (req, res, next) => {
  const findDestionations = await Destinations.find()
    .populate("packages")
    .populate("hotels");

  if (findDestionations.length === 0) {
    return res.status(404).json({ message: "No Destinations Found" });
  }

  res.status(200).json({
    success: true,
    message: "Destinations fetched successfully",
    data: findDestionations,
  });
});

export const getSingleDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const findDestionation = await Destinations.findById(id)
    .populate("packages")
    .populate("hotels");

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
  const destination = await Destinations.findById(id);
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

  const deleteDestination = await Destinations.findByIdAndDelete(id);

  if (deleteDestination == null) {
    return res.status(404).json({ message: "No Destination with ID found" });
  }

  res.status(200).json({
    success: true,
    message: "Destionation deleted successfully",
    data: deleteDestination,
  });
});
