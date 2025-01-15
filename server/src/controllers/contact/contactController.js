import Contact from "../../models/contact/contact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";
import { z } from "zod";

export const submitContactForm = asyncHandler(async (req, res, next) => {
  // Delete the old submission if it exists
  await Contact.findOneAndDelete({
    email: req.body?.email,
  });
  const contact = await Contact.create(req.body);
  if (!contact) {
    return next(new ApiErrorResponse("Contact form submission failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Contact form submitted successfully",
    data: contact,
  });
});

export const getAllContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: contacts, pagination } = await paginate(
    Contact, // Model
    page, // Current page
    limit // Limit per page
    // [], // No population needed
    // {}, // No filters
    // "" // No fields to exclude or select
  );

  // Check if no contacts are found
  if (!contacts || contacts.length === 0) {
    return next(new ApiErrorResponse("No Contacts found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All contacts found successfully",
    pagination, // Include pagination metadata
    data: contacts,
  });
});

export const deleteContactById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the contact by ID
  const deletedContact = await Contact.findByIdAndDelete(id);

  // If the contact is not found
  if (!deletedContact || deletedContact.length === 0) {
    return next(new ApiErrorResponse("Contact not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
  });
});
