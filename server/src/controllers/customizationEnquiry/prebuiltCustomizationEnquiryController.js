import PreBuiltPackageCustomizationEnquiry from "../../models/customizationEnquiry/preBuiltPackageCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendPreBuiltPackageCustomizationEnquiryMail } from "../../utils/Mail/emailTemplates.js";

export const createPreBuiltPackageCustomizationEnquiry = asyncHandler(
  async (req, res, next) => {
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
      package: packageDetails,
      selectedVehicle,
      estimatedPrice,
    } = newEnquiry;
    const data = {
      name,
      email,
      mobileNumber,
      numberOfTravellers,
      package: packageDetails.name,
      message,
      vehicle: selectedVehicle.name,
      estimatedPrice,
    };
    await sendPreBuiltPackageCustomizationEnquiryMail(
      process.env.NODEMAILER_EMAIL_USER,
      data
    )
      .then(() => {
        return res.status(200).json({
          success: true,
          message:
            "Your enquiry has been successfully created. A notification email has been sent to our team, and we will get back to you shortly.",
          data: newEnquiry,
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: `Your enquiry has been created, but we encountered an issue while sending a notification email to our team. Please rest assured, we will still review your enquiry. Error: ${error.message}`,
        });
      });
  }
);
