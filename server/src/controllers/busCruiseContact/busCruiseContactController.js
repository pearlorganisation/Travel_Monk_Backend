import BusCruiseContact from "../../models/busCruiseContact/busCruiseContact.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createBusCruiseContact = asyncHandler(async (req, res, next) => {
  const newBusCruiseContact = await BusCruiseContact.create(req.body);
  if (!newBusCruiseContact) {
    return next(new ApiErrorResponse("Contact is not created", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Contact is created",
    data: newBusCruiseContact,
  });
});

export const getAllBusCruiseContacts = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
 
  // Define the query filter
  let filter = {};
  if (type && type.length > 0) {
   filter.type = {
    $in: type.map(t => new RegExp(t, "i"))
   };
 }

 
  // Find contacts with the filter
  const busCruiseContacts = await BusCruiseContact.find(filter);

  if (!busCruiseContacts || busCruiseContacts.length === 0) {
    return next(new ApiErrorResponse("No Contacts found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "All contacts found successfully",
    data: busCruiseContacts,
  });
});

export const getBusCruiseContactById = asyncHandler(async (req, res, next) => {
  const busCruiseContact = await BusCruiseContact.findById(req.params.id);
  if (!busCruiseContact) {
    return next(new ApiErrorResponse("Contact not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Contact found",
    data: busCruiseContact,
  });
});

export const updateBusCruiseContact = asyncHandler(async (req, res, next) => {
  const updatedBusCruiseContact = await BusCruiseContact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBusCruiseContact) {
    return next(new ApiErrorResponse("Contact not found or not updated", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Contact updated",
    data: updatedBusCruiseContact,
  });
});

export const deleteBusCruiseContact = asyncHandler(async (req, res, next) => {
  const deletedBusCruiseContact = await BusCruiseContact.findByIdAndDelete(
    req.params.id
  );
  if (!deletedBusCruiseContact) {
    return next(new ApiErrorResponse("Contact not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Contact deleted",
  });
});
