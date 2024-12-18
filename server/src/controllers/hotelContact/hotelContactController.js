import HotelContact from "../../models/hotelContact/hotelContact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createHotelContact = asyncHandler(async (req, res, next) => {
  const newHotelContact = await HotelContact.create(req.body);
  if (!newHotelContact) {
    return next(new ApiErrorResponse("Contact is not created", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Contact is created",
    data: newHotelContact,
  });
});
