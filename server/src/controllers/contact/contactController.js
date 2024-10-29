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
