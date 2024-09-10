import Package from "../../models/package/package.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

//Create Package
export const createPackage = asyncHandler(async (req, res, next) => {
  const {
    name,
    duration,
    itinerary,
    pricing,
    inclusions,
    exclusions,
    premiumAddons,
  } = req.body;

  if (!name || !duration) {
    return next(
      new ApiErrorResponse("Please provide all required fields", 400)
    );
  }

  const newPackage = new Package({
    name,
    duration,
    itinerary,
    pricing,
    inclusions,
    exclusions,
    premiumAddons,
  });
  await newPackage.save();

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
