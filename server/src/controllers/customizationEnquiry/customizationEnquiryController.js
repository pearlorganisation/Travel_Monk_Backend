import PreBuiltPackageCustomizationEnquiry from "../../models/customizationEnquiry/preBuiltPackageCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createPreBuiltPackageCustomizationEnquiry = asyncHandler(
  async (req, res, next) => {
    const newEnquiry = await PreBuiltPackageCustomizationEnquiry.create(
      req.body
    );
    if (!newEnquiry) {
      return next(new ApiErrorResponse("Enquiry not created", 400));
    }
    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: newEnquiry,
    });
  }
);
