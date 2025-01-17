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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { data: packages, pagination } = await paginate(Package, page, limit, [
    { path: "packageDestination" },
  ]);
  if (!packages || packages.length === 0) {
    return next(new ApiErrorResponse("Packages not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Packages retrieved successfully",
    pagination,
    data: packages,
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
  const { image, banner } = req.files;
  const existingPackage = await Package.findById(req.params.packageId);
  if (!existingPackage) {
    return next(new ApiErrorResponse("Package not found", 404));
  }
  let uploadedImage;
  let uploadedBanner;
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    if (existingPackage.image) {
      const filePath = path.join(
        __dirname,
        "../../../public",
        existingPackage.image.path
      );
      await deleteFile(filePath);
    }
  }
  if (banner) {
    uploadedBanner = {
      filename: banner[0].newFilename,
      path: `uploads/${banner[0].newFilename}`,
    };
    if (existingPackage.banner) {
      const filePath = path.join(
        __dirname,
        "../../../public",
        existingPackage.banner.path
      );
      await deleteFile(filePath);
    }
  }

  const updatedPackage = await Package.findByIdAndUpdate(
    req.params.packageId,
    {
      ...req.body,
      image: uploadedImage || existingPackage.image, // Retain the old image if no new image is provided
      banner: uploadedBanner || existingPackage.banner,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPackage) {
    return next(new ApiErrorResponse("Package not found or not updated", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Package updated successfully",
    data: updatedPackage,
  });
});

//Delete Package By Id
export const deletePackageById = asyncHandler(async (req, res, next) => {
  const deletedPackage = await Package.findByIdAndDelete(req.params?.packageId); // Return null if no doc found
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
