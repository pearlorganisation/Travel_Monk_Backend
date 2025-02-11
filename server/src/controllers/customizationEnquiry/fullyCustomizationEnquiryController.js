import FullyCustomizeEnquiry from "../../models/customizationEnquiry/fullyCustomizationEnquiry.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendFullyCustomizeEnquiryMail } from "../../utils/Mail/emailTemplates.js";
import { paginate } from "../../utils/pagination.js";

export const createFullyCustomizeEnquiry = asyncHandler(
  async (req, res, next) => {
    // Create a new enquiry
    const newEnquiry = await FullyCustomizeEnquiry.create({
      ...req.body,
      user: req.user._id,
    });

    // If the enquiry is not created, return an error response
    if (!newEnquiry) {
      return next(new ApiErrorResponse("Enquiry not created", 400));
    }
    const enquiryData = await FullyCustomizeEnquiry.findById(newEnquiry._id)
      .select("selectedVehicle destination")
      .populate({ path: "selectedVehicle", select: "vehicleName -_id" })
      .populate({ path: "destination", select: "name -_id" });

    // Destructure the required fields from the created enquiry
    const {
      name,
      email,
      message,
      mobileNumber,
      numberOfTravellers,
      estimatedPrice,
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
      startDate,
      endDate,
      duration,
      destinationName: enquiryData.destination.name,
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

export const getAllFullyCustomizeEnquiries = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page || "1"); // Default to page 1
    const limit = parseInt(req.query.limit || "10"); // Default to 10 items per page
    const { data: enquiries, pagination } = await paginate(
      FullyCustomizeEnquiry,
      page,
      limit,
      [
        { path: "user", select: "name email" },
        { path: "destination" },
        { path: "selectedVehicle" },
        { path: "itinerary.selectedHotel" },
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

export const getFullyCustomizeEnquiryById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    // Attempt to find the enquiry by ID
    const enquiry = await FullyCustomizeEnquiry.findById(id)
      .populate({ path: "user", select: "name email" })
      .populate({ path: "destination" }) // Can select other required fields
      .populate({ path: "selectedVehicle" })
      // .populate({
      //   path: "itinerary.selectedHotel",
      // })
      // .populate({
      //   path: "itinerary.selectedActivities.value",
      // });

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

export const deleteFullyCustomizeEnquiryById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    // Attempt to find and delete the enquiry by ID
    const deletedEnquiry = await FullyCustomizeEnquiry.findByIdAndDelete(id);

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

export const getMyFullyCustomizeEnquiries = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page || "1"); // Default to page 1
    const limit = parseInt(req.query.limit || "10"); // Default to 10 items per page

    const { data: enquiries, pagination } = await paginate(
      FullyCustomizeEnquiry,
      page,
      limit,
      [],
      { user: req.user._id }
    );

    if (!enquiries || enquiries.length === 0) {
      return next(new ApiErrorResponse("No enquiries found", 404));
    }

    return res.status(200).json({
      success: true,
      message:
        "Your fully customized package enquiries were found successfully.",
      pagination,
      data: enquiries,
    });
  }
);

export const updateFullyCustomizeEnquiryById = asyncHandler(async (req, res, next) => {
  const {
    id
  } = req.params;

  // Ensure duration exists before modifying it
  let updateData = {
    ...req.body
  };

  if (req.body.duration) {
    updateData["duration.days"] = req.body.duration.days;
    updateData["duration.nights"] = req.body.duration.nights;
    delete updateData.duration; // Remove the entire duration object to avoid conflicts
  }

  console.log("Final update data:", updateData);

  // Find and update the enquiry
  const updatedEnquiry = await FullyCustomizeEnquiry.findByIdAndUpdate(
    id, {
      $set: updateData
    }, // Ensure `duration` isn't updated as a whole while also updating its fields
    {
      new: true,
      runValidators: true
    }
  );

  // If the enquiry is not found, return an error response
  if (!updatedEnquiry) {
    return next(new ApiErrorResponse("Enquiry not found", 404));
  }

  // Respond with the updated enquiry
  res.status(200).json({
    success: true,
    message: "Enquiry updated successfully",
    data: updatedEnquiry,
  });
});
