import PreBuiltPackageCustomizationEnquiry from "../../models/customizationEnquiry/preBuiltPackageCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendPreBuiltPackageCustomizationEnquiryMail } from "../../utils/Mail/emailTemplates.js";

export const createPreBuiltPackageCustomizationEnquiry = asyncHandler(
  async (req, res, next) => {
    const {
      itinerary
    } = req.body
    console.log("------------------itineraray", itinerary)
    const newEnquiry = await PreBuiltPackageCustomizationEnquiry.create(
      req.body
    );
    if (!newEnquiry) {
      return next(new ApiErrorResponse("Enquiry not created", 400));
    }

    const {
      name,
      email,
      message,
      mobileNumber,
      numberOfTravellers,
      package: packageId,
    } = newEnquiry;
    const data = {
      name,
      email,
      mobileNumber,
      numberOfTravellers,
      package: packageId,
      message,
    };
    await sendPreBuiltPackageCustomizationEnquiryMail(
      process.env.NODEMAILER_EMAIL_USER,
      data
    );
    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: newEnquiry,
    });
  }
);
