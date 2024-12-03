import FullyCustomizeEnquiry from "../../models/customizationEnquiry/fullyCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendFullyCustomizeEnquiryMail } from "../../utils/Mail/emailTemplates.js";

export const createFullyCustomizeEnquiry = asyncHandler(
  async (req, res, next) => {
    // Create a new enquiry
    const newEnquiry = await FullyCustomizeEnquiry.create(req.body);

    // If the enquiry is not created, return an error response
    if (!newEnquiry) {
      return next(new ApiErrorResponse("Enquiry not created", 400));
    }

    // Destructure the required fields from the created enquiry
    const {
      name,
      email,
      message,
      mobileNumber,
      numberOfTravellers,
      estimatedPrice,
      destinationName,
      startDate,
      endDate,
      duration,
    } = newEnquiry;

    // Prepare the data for the email
    const data = {
      name,
      email,
      mobileNumber,
      numberOfTravellers,
      estimatedPrice,
      message,
      destinationName,
      startDate,
      endDate,
      duration,
    };

    // Send an email notification about the new enquiry
    await sendFullyCustomizeEnquiryMail(
      process.env.NODEMAILER_EMAIL_USER,
      data
    );

    // Return a success response with the created enquiry
    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: newEnquiry,
    });
  }
);
