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
    const enquiryData = await FullyCustomizeEnquiry.findById(newEnquiry._id)
      .select("selectedVehicle")
      .populate({ path: "selectedVehicle", select: "vehicleName -_id" });

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
      vehicleName: enquiryData.selectedVehicle.vehicleName,
    };

    // Send an email notification about the new enquiry
    await sendFullyCustomizeEnquiryMail(process.env.NODEMAILER_EMAIL_USER, data)
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
