import Contact from "../../models/contact/contact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const submitContactForm = asyncHandler(async (req, res, next) => {
  const contactInfo = await Contact.create(req.body);
  if (!contactInfo) {
    return next(new ApiErrorResponse("Contact form submission failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Contact form submitted successfully",
    data: contactInfo,
  });
});
