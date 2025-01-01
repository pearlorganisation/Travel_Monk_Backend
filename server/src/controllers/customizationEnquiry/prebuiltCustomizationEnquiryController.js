import PreBuiltPackageCustomizationEnquiry from "../../models/customizationEnquiry/preBuiltPackageCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendPreBuiltPackageCustomizationEnquiryMail } from "../../utils/Mail/emailTemplates.js";
import { paginate } from "../../utils/pagination.js";

export const createPreBuiltPackageCustomizationEnquiry = asyncHandler(
  async (req, res, next) => {
    const newEnquiry = await PreBuiltPackageCustomizationEnquiry.create({
      ...req.body,
      user: req.user._id,
    });
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

// Get all pre-built package customization enquiries
export const getAllPreBuiltPackageCustomizationEnquiries = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page || "1"); // Default to page 1
    const limit = parseInt(req.query.limit || "10"); // Default to 10 items per page
    const { data: enquiries, pagination } = await paginate(
      PreBuiltPackageCustomizationEnquiry,
      page,
      limit,
      [
        { path: "user", select: "name email" },
        { path: "package.packageId" }, // Can choose what to select for all
        { path: "selectedVehicle.vehicle" },
        { path: "itinerary.selectedHotel.hotel" },
        { path: "itinerary.selectedActivities.value" },
      ]
    );

    // Check if enquiries exist
    if (!enquiries || enquiries.length === 0) {
      return next(new ApiErrorResponse("No enquiries found", 404));
    }

    // Respond with the populated enquiries
    res.status(200).json({
      success: true,
      message: "Enquiries found successfully",
      pagination,
      data: enquiries,
    });
  }
);

// Get a single pre-built package customization enquiry by ID
export const getPreBuiltPackageCustomizationEnquiryById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    // Attempt to find the enquiry by ID
    const enquiry = await PreBuiltPackageCustomizationEnquiry.findById(id)
      .populate({ path: "user", select: "name email" })
      .populate({ path: "package.packageId" })
      .populate({ path: "selectedVehicle.vehicle" })
      .populate({ path: "itinerary.selectedHotel.hotel" })
      .populate({ path: "itinerary.selectedActivities.value" });

    // If the enquiry is not found, return an error response
    if (!enquiry) {
      return next(new ApiErrorResponse("Enquiry not found", 404));
    }

    // Respond with the populated enquiry
    res.status(200).json({
      success: true,
      message: "Enquiry found successfully",
      data: enquiry,
    });
  }
);

// Delete a pre-built package customization enquiry by ID
export const deletePreBuiltPackageCustomizationEnquiryById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    // Attempt to find and delete the enquiry by ID
    const deletedEnquiry =
      await PreBuiltPackageCustomizationEnquiry.findByIdAndDelete(id);

    // If the enquiry is not found, return an error response
    if (!deletedEnquiry) {
      return next(new ApiErrorResponse("Enquiry not found", 404));
    }

    // Respond with a success message if the enquiry is deleted
    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  }
);
