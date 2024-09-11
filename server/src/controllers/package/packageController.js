import Package from "../../models/package/package.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

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
  const newPackage = await Package.create(req.body);
  if (!newPackage || newPackage.length === 0) {
    return next(new ApiErrorResponse("Package is not created", 400));
  }
  return res
    .status(201)
    .json({ success: true, message: "Package is created", data: newPackage });
});

//Get Package By Id
export const getPackageById = asyncHandler(async (req, res, next) => {
  const packageDoc = await Package.findById(req.params?.packageId).populate(
    "itinerary"
  );
  if (!packageDoc || packageDoc.length === 0) {
    return next(new ApiErrorResponse("Package not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Package found successfully",
    data: packageDoc,
  });
});

//Update Package By Id
export const updatePackageById = asyncHandler(async (req, res, next) => {
  const updatedPackage = await Package.findByIdAndUpdate(
    req.params?.packageId,
    req.body,
    { new: true }
  ).populate("itinerary");

  if (!updatedPackage || updatedPackage.length === 0) {
    return next(new ApiErrorResponse("Package not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Package is updated",
    data: updatedPackage,
  });
});

//Delete Package By Id
export const deletePackageById = asyncHandler(async (req, res, next) => {
  const deletedPackage = await Package.findByIdAndDelete(req.params?.packageId);
  if (!deletedPackage || deletedPackage.length === 0) {
    return next(new ApiErrorResponse("Package not found.", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Package is deleted." });
});
