import PartnerType from "../../models/partnerType/partnerType.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

// @desc Create a new Partner Type
// @route POST /api/v1/partnerType
export const createPartnerType = asyncHandler(async (req, res, next) => {
  const newPartnerType = await PartnerType.create(req.body);
  if (!newPartnerType) {
    return next(new ApiErrorResponse("Partner Type is not created", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Partner Type is created",
    data: newPartnerType,
  });
});

// @desc Get all Partner Types
// @route GET /api/v1/partnerType
export const getAllPartnerTypes = asyncHandler(async (req, res, next) => {
  const partnerTypes = await PartnerType.find();
  if (!partnerTypes) {
    return next(new ApiErrorResponse("No Partner Types found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "All Partner Type reterived successfully",
    data: partnerTypes,
  });
});

// @desc Get a single Partner Type by ID
// @route GET /api/v1/partnerType/:id
export const getPartnerTypeById = asyncHandler(async (req, res, next) => {
  const partnerType = await PartnerType.findById(req.params.id);
  if (!partnerType) {
    return next(new ApiErrorResponse("Partner Type not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Partner Type reterived successfully",
    data: partnerType,
  });
});

// @desc Update a Partner Type by ID
// @route PUT /api/v1/partnerType/:id
export const updatePartnerType = asyncHandler(async (req, res, next) => {
  const updatedPartnerType = await PartnerType.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPartnerType) {
    return next(
      new ApiErrorResponse("Partner Type not found or not updated", 404)
    );
  }
  return res.status(200).json({
    success: true,
    message: "Partner Type updated",
    data: updatedPartnerType,
  });
});

// @desc Delete a Partner Type by ID
// @route DELETE /api/v1/partnerType/:id
export const deletePartnerType = asyncHandler(async (req, res, next) => {
  const deletedPartnerType = await PartnerType.findByIdAndDelete(req.params.id);
  if (!deletedPartnerType) {
    return next(new ApiErrorResponse("Partner Type not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Partner Type deleted",
  });
});
