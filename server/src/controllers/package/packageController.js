import Package from "../../models/package/package.js";
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

export const getAllPackages = asyncHandler(async (req, res, next) => {
  const { destination } = req.query;

  const limit = req.query?.limit || 50;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * limit;

  let filter = {};
  if (destination) {
    filter.destination = { $regex: new RegExp(destination, "i") }; // Case-insensitive search
  }
  const packages = await Package.find(filter).skip(skip).limit(limit).populate("itinerary.activities");
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

export const createPackage = asyncHandler(async (req, res, next) => {
  const { image, banner } = req.files;
  console.log("REQ File: ", req.files);
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
      "../../../public/" + uploadedImage.path
    );
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }
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
      "../../../public/" + uploadedBanner.path
    );
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }
    fs.renameSync(banner[0].filepath, targetPath);
  }

  const newPackage = await Package.create({
    ...req?.body,
    image: uploadedImage,
    banner: uploadedBanner,
  });

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
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    return next(new ApiErrorResponse("Package not found", 404));
  }
  const { itinerary, duration, inclusions, exclusions, ...otherUpdates } =
    req.body;
  console.log(req.body);
  const { image, banner } = req.files;
  let uploadedImage;
  let uploadedBanner;
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    if (packageData.image) {
      const filePath = path.join(
        __dirname,
        "../../../public",
        packageData.image.path
      );
      await deleteFile(filePath);
    }
    packageData.image = uploadedImage;
  }
  if (banner) {
    uploadedBanner = {
      filename: banner[0].newFilename,
      path: `uploads/${banner[0].newFilename}`,
    };
    if (packageData.banner) {
      const filePath = path.join(
        __dirname,
        "../../../public",
        packageData.banner.path
      );
      await deleteFile(filePath);
    }
    packageData.banner = uploadedBanner;
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
  console.log("the deleted id is", req.params.packageId)
  if (!deletedPackage) {
    return next(new ApiErrorResponse("Package not found.", 404));
  }
  // Delete the image file from the server
  if (deletedPackage.image) {
    const imagePath = path.join(
      __dirname,
      "../../../public",
      deletedPackage.image.path
    );
    try {
      await deleteFile(imagePath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting package image:", error);
      return next(
        new ApiErrorResponse("Error deleting package image from server", 500)
      );
    }
  }

  // Delete the banner file from the server
  if (deletedPackage.banner) {
    const bannerPath = path.join(
      __dirname,
      "../../../public",
      deletedPackage.banner.path
    );
    try {
      await deleteFile(bannerPath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting package banner:", error);
      return next(
        new ApiErrorResponse("Error deleting package banner from server", 500)
      );
    }
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
