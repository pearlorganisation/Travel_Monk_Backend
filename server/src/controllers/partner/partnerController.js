import Partner from "../../models/partner/partner.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { deleteFile } from "../../utils/fileUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPartner = asyncHandler(async (req, res, next) => {
  try {
    const { partnerName, partnerType } = req.body; // Example fields from the body
    const files = req.files?.partnerLogo;

    let savedLogo = null;

    // Check if file is provided
    if (!files || files.length === 0) {
      res.status(400);
      throw new Error("Partner logo is required.");
    }

    // Process the first uploaded file
    const file = files[0];
    const publicPath = path.join("uploads", file.newFilename); // Relative path for saving
    const targetPath = path.join(__dirname, "../../../public", publicPath); // Full path on the server
    console.log("Public path: ", publicPath);
    console.log("Target path: ", targetPath);

    // Move the file to the uploads directory if not already there
    if (!fs.existsSync(targetPath)) {
      fs.renameSync(file.filepath, targetPath);
      console.log("File moved successfully.");
    }

    // Prepare the saved logo object
    savedLogo = {
      filename: file.newFilename,
      path: publicPath, // Save relative path
    };

    // Create the partner in the database
    const newPartner = await Partner.create({
      partnerName,
      partnerType,
      partnerLogo: savedLogo, // Save image object
    });

    // If partner creation fails
    if (!newPartner) {
      return next(new ApiErrorResponse("Partner is not created", 400));
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Partner is created successfully!",
      data: newPartner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export const getAllPartners = asyncHandler(async (req, res, next) => {
  const partners = await Partner.find().populate("partnerType"); // Populate partnerType for more info
  if (!partners) {
    return next(new ApiErrorResponse("No Partners found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "All partners found successfully",
    data: partners,
  });
});

export const getPartnerById = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id).populate("partnerType");
  if (!partner) {
    return next(new ApiErrorResponse("Partner not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Partner found successfully",
    data: partner,
  });
});

export const updatePartnerById = asyncHandler(async (req, res, next) => {
  const { partnerLogo } = req.files; // Safely access req.files
  let uploadedLogo;

  // Only upload logo if it's provided
  if (partnerLogo) {
    uploadedLogo = await uploadFileToCloudinary(partnerLogo); // Assuming this function exists
  }

  // Prepare the update object
  const updateData = {
    ...req.body,
  };

  // If a new logo is uploaded, include it in the update
  if (uploadedLogo) {
    updateData.partnerLogo = uploadedLogo[0]; // Assuming uploadFileToCloudinary returns an array
  }

  const updatedPartner = await Partner.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPartner) {
    return next(new ApiErrorResponse("Partner not found or not updated", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Partner is updated",
    data: updatedPartner,
  });
});

export const deletePartnerById = asyncHandler(async (req, res, next) => {
  const deletedPartner = await Partner.findByIdAndDelete(req.params.id);
  if (!deletedPartner) {
    return next(new ApiErrorResponse("Partner not found", 404));
  }

  // Delete the logo image file using the utility
  if (deletedPartner.partnerLogo) {
    const filePath = path.join(
      __dirname,
      "../../../public",
      deletedPartner.partnerLogo.path
    ); // Absolute path to the image
    console.log(filePath);
    try {
      await deleteFile(filePath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting partner logo image:", error);
      return next(
        new ApiErrorResponse(
          "Error deleting partner logo image from server",
          500
        )
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Partner is deleted",
  });
});
