import IndianDestinations from "../../models/trip/indian_destinations.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createIndianDestination = asyncHandler(async (req, res, next) => {
  const { name, startingPrice, packages, hotels } = req.body;
  if (!name || !startingPrice) {
    return next(new ApiErrorResponse("All fields are required", 400));
  }

  const { image, banner } = req.files;
  let uploadedImage = [];
  let uploadedBanner = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image);
  }

  if (banner) {
    uploadedBanner = await uploadFileToCloudinary(banner);
  }
  const newIndianDestination = new IndianDestinations({
    name,
    startingPrice,
    image: uploadedImage[0],
    banner: uploadedBanner[0],
    packages,
    hotels,
  });
  await newIndianDestination.save();

  res.status(201).json({
    success: true,
    message: "Indian Destination created successfully!",
    data: newIndianDestination,
  });
});

export const getIndianDestination = asyncHandler(async (req, res, next) => {
  const findDestionations = await IndianDestinations.find()
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

export const getSingleIndianDestination = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const findDestionation = await IndianDestinations.findById(id)
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
  }
);

export const updateIndianDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, banner, image, startingPrice, packages } = req.body;
  const indianDestination = await IndianDestinations.findById(id);
  if (!indianDestination) {
    return next(new ApiErrorResponse("Indian destination not found", 404));
  }

  //If Packages is provided
  if (packages && Array.isArray(packages)) {
    const existingPackages = indianDestination.packages.map((pkg) =>
      pkg.toString()
    );
    const newPackages = packages.filter(
      (pkg) => !existingPackages.includes(pkg)
    );
    indianDestination.packages.push(...newPackages);
  }
  const updateDestination = await IndianDestinations.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (updateDestination == null) {
    return res.status(404).json({ message: "No Destination with ID found" });
  }

  res.status(200).json({
    success: true,
    message: "Destionation updated successfully",
    data: updateDestination,
  });
});

export const deleteIndianDestination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleteDestination = await IndianDestinations.findByIdAndDelete(id);

  if (deleteDestination == null) {
    return res.status(404).json({ message: "No Destination with ID found" });
  }

  res.status(200).json({
    success: true,
    message: "Destionation deleted successfully",
    data: deleteDestination,
  });
});
