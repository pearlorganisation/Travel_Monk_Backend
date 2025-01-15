import CustomPackage from "../../models/customPackage/customPackage.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createCustomPackage = asyncHandler(async (req, res, next) => {
  const customPackage = await CustomPackage.create(req.body);
  if (!customPackage) {
    return next(new ApiErrorResponse("Custom Package is not created", 400));
  }
  res.status(201).json({ success: true, message: "Custom Package is created" });
});
