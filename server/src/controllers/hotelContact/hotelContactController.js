import HotelContact from "../../models/hotelContact/hotelContact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { sendHotelEnquiryMail } from "../../utils/Mail/emailTemplates.js";
import { paginate } from "../../utils/pagination.js";

export const createHotelContact = asyncHandler(async (req, res, next) => {
  const newHotelContact = await HotelContact.create(req.body);
  if (!newHotelContact) {
    return next(new ApiErrorResponse("Contact is not created", 400));
  }
  await sendHotelEnquiryMail(process.env.NODEMAILER_EMAIL_USER, req.body) // send hotel name to data
    .then(() => {
      return res.status(201).json({
        success: true,
        message:
          "Your enquiry has been successfully created. A notification email has been sent to our team, and we will get back to you shortly.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: `Your enquiry has been created, but we encountered an issue while sending a notification email to our team. Please rest assured, we will still review your enquiry. Error: ${error.message}`,
      });
    });
});

export const getAllHotelContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: hotelContacts, pagination } = await paginate(
    HotelContact, // Model
    page, // Current page
    limit, // Limit per page
    [{ path: "hotel" }]
    // {}, // No filters
    // "" // No fields to exclude or select
  );

  // Check if no hotelContacts are found
  if (!hotelContacts || hotelContacts.length === 0) {
    return next(new ApiErrorResponse("No Hotel Contacts found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "Hotel contacts found successfully",
    pagination,
    data: hotelContacts,
  });
});

export const getHotelContactById = asyncHandler(async (req, res, next) => {
  const hotelContact = await HotelContact.findById(req.params.id).populate({
    path: "hotel",
  });
  if (!hotelContact) {
    return next(new ApiErrorResponse("Hotel contact not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Hotel contact found",
    data: hotelContact,
  });
});

export const deleteHotelContact = asyncHandler(async (req, res, next) => {
  const deletedHotelContact = await HotelContact.findByIdAndDelete(
    req.params.id
  );
  if (!deletedHotelContact) {
    return next(new ApiErrorResponse("Hotel contact not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Hotel contact deleted",
  });
});
