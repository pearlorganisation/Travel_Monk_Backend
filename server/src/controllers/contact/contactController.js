import Contact from "../../models/contact/contact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
 import { z } from "zod"

// schema for contact validation
const contactSchemaValidation = z.object({
   name: z.string().min(1, "At least 1 character"),
   email: z.string().email(),  
   phoneNumber: z.string().min(1, "At least 1 character")    
   .regex(/^\+?[1-9]\d{1,14}$/, {
     message: "Invalid phone number format"
   }),  
   message: z.string().min(1, "At least 1 character"),
})

export const submitContactForm = asyncHandler(async (req, res, next) => {
    // validation 
   const {name , email, phoneNumber, message } = req.body;
   // try catch for validation
   try {
       const validateData = contactSchemaValidation.parse({name , email, phoneNumber, message});

       console.log(validateData);
   } catch (error) {
      if (error instanceof z.ZodError) {

        console.error(error.errors);
        return next(new ApiErrorResponse("Enter correct no format",error))  
      } else {
        console.error("An unexpected error occurred:", error);
        return next(new ApiErrorResponse("Unexpected error",error));
      }
   }
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

export const getAllContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find();
  if (!contacts || contacts.length === 0) {
    return next(new ApiErrorResponse("No Contacts found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "All contacts found successfully",
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
    data: deletedContact,
  });
});
