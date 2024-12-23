import Package from "../../models/package/package.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const getAllPackages = asyncHandler(async (req, res, next) => {
  const { destination } = req.query;

  const limit = req.query?.limit || 10;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * limit;

  let filter = {};
  if (destination) {
    filter.destination = { $regex: new RegExp(destination, "i") }; // Case-insensitive search
  }
  const packages = await Package.find(filter).skip(skip).limit(limit);
  const total = await Package.countDocuments(filter);
  if (!packages || packages.length === 0) {
    return next(new ApiErrorResponse("Packages not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Packages retrieved successfully",
    data: packages,
    pagination: { total, page: pageNumber, pages: Math.ceil(total / limit) },
  });
});

//Create Package
export const createPackage = asyncHandler(async (req, res, next) => {
  const { image, banner } = req.files;
  let uploadedImage = [];
  let uploadedBanner = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image); // [{}]
  }
  if (banner) {
    uploadedBanner = await uploadFileToCloudinary(banner); // [{}]
  }
  const newPackage = await Package.create({
    ...req?.body,
    image: uploadedImage[0],
    banner: uploadedBanner[0],
  });
  if (!newPackage) {
    return next(new ApiErrorResponse("Package is not created", 400));
  }
  return res
    .status(201)
    .json({ success: true, message: "Package is created", data: newPackage });
});

//Get Package By Id
export const getPackageById = asyncHandler(async (req, res, next) => {
  const packageDoc = await Package.findById(req.params?.packageId).populate(
    "itinerary.activities"
  );

  if (!packageDoc) {
    // return null if no doc found
    return next(new ApiErrorResponse("Package not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Package found successfully",
    data: packageDoc,
  });
});

export const updatePackageById = asyncHandler(async (req, res, next) => {
  const { packageId } = req.params;
  // Find the package by ID
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    return next(new ApiErrorResponse("Package not found", 404));
  }
  const { itinerary, duration, inclusions, exclusions, ...otherUpdates } =
    req.body;

  const { image, banner } = req.files;
  let uploadedImage = [];
  let uploadedBanner = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image); // [{}]
  }
  if (banner) {
    uploadedBanner = await uploadFileToCloudinary(banner); // [{}]
  }

  // if array is not empty then we will overwrite the image with new one
  if (uploadedImage.length > 0) {
    packageData.image = uploadedImage[0]; // Assign the first image (assuming single image upload)
  }

  if (uploadedBanner.length > 0) {
    packageData.banner = uploadedBanner[0]; // Assign the first banner (assuming single banner upload)
  }

  // Update itinerary if provided
  if (itinerary && Array.isArray(itinerary)) {
    // Handle updates for existing itinerary items
    const updatePromises = itinerary.map((item) => {
      const { _id, day, description } = item;
      return Package.updateOne(
        { _id: packageId, "itinerary._id": _id },
        {
          $set: {
            "itinerary.$.day": day,
            "itinerary.$.description": description,
          },
        }
      );
    });
    await Promise.all(updatePromises);
  }

  // // Update pricing fields without replacing existing subfields
  // if (pricing) {
  //   Object.keys(pricing).forEach((key) => {
  //     packageData.pricing[key] = {
  //       ...packageData.pricing[key],
  //       ...pricing[key],
  //     };
  //   });
  // }

  // Update duration fields without replacing existing subfields
  if (duration) {
    packageData.duration = {
      ...packageData.duration,
      ...duration,
    };
  }

  // Push new items to inclusions and exclusions arrays
  if (inclusions && Array.isArray(inclusions)) {
    await Package.updateOne(
      { _id: packageId },
      { $addToSet: { inclusions: { $each: inclusions } } }
    );
  }

  if (exclusions && Array.isArray(exclusions)) {
    await Package.updateOne(
      { _id: packageId },
      { $addToSet: { exclusions: { $each: exclusions } } }
    );
  }

  // Handle updates for premiumAddons
  if (premiumAddons && Array.isArray(premiumAddons)) {
    premiumAddons.forEach(async (addon) => {
      const { name, price, _id } = addon;
      await Package.updateOne(
        { _id: packageId, "premiumAddons._id": _id },
        {
          $set: {
            "premiumAddons.$.price": price,
            "premiumAddons.$.name": name,
          },
        },
        { upsert: true } // Use upsert if you want to add the addon if it doesn't exist
      );
    });
  }

  Object.keys(otherUpdates).forEach((key) => {
    packageData[key] = otherUpdates[key];
  });
  await packageData.save();

  const updatedPackage = await Package.findById(packageId); // Get the latest update
  return res.status(200).json({
    success: true,
    message: "Package is updated",
    data: updatedPackage,
  });
});

//Delete Package By Id
export const deletePackageById = asyncHandler(async (req, res, next) => {
  const deletedPackage = await Package.findByIdAndDelete(req.params?.packageId); // Return null if no doc found
  if (!deletedPackage) {
    return next(new ApiErrorResponse("Package not found.", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Package is deleted." });
});

//Get Package By Destination Id
export const getPackagesByDestination = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: packages, pagination } = await paginate(
    Package,
    page,
    limit,
    [{ path: "packageDestination", select: " name banner" }],
    { packageDestination: req.params.destinationId }
  );

  if (!packages || packages.length === 0) {
    return next(new ApiErrorResponse("No packages found for destination", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Packages found for destination",
    pagination,
    data: packages,
  });
});
