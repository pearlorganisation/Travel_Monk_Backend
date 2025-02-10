import CustomPackage from "../../models/customPackage/customPackage.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createCustomPackage = asyncHandler(async (req, res, next) => {
  const customPackage = await CustomPackage.create(req.body);
  if (!customPackage) {
    return next(new ApiErrorResponse("Custom Package is not created", 400));
  }
  res.status(201).json({ success: true, message: "Custom Package is created" });
});

/** to get the packages */
export const getCustomPackages = asyncHandler(async (req, res, next) => {
  const packages = await CustomPackage.find().populate([
    { path: "user", select: "-password" },
    {
      path: "itinerary.selectedHotel",
    },
    {
      path: "selectedVehicle",
    },
  ]);
  if (!packages) {
    return next(new ApiErrorResponse("Unable to get any custom packages", 400));
  }
  res
    .status(201)
    .json({ success: true, message: "Packages recieved", data: packages });
});

export const updateCustomPackageById = asyncHandler(async (req, res, next) => {
  const packageUpdate = await CustomPackage.findByIdAndUpdate(
    req?.params?.id,
    req?.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!packageUpdate) {
    return next(new ApiErrorResponse("Failed to Update the Package", 400));
  }
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    data: packageUpdate,
  });
});

/**delete the custom package by id */
export const deleteCustomPackage = asyncHandler(async (req, res, next) => {
  const packageDelete = await CustomPackage.findByIdAndDelete(req?.params?.id);
  if (!packageDelete) {
    return next(new ApiErrorResponse("Failed to Delete the Package", 400));
  }
  res.status(201).json({ success: true, message: "Deleted Successfully" });
});
