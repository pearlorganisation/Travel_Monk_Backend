import IndianDestinations from "../../models/trip/indian_destinations.js";
import InternationalDestinations from "../../models/trip/international_destinations.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createInternationalDestination = asyncHandler(
  async (req, res, next) => {
    const { name, startingPrice, packages } = req.body;
    if (!name || !startingPrice) {
      return next(new ApiErrorResponse("All fields are required", 400));
    }

    const { image, banner } = req.files;
    let uploadedImage = [];
    let uploadedBanner = [];
    if (image) {
      uploadedImage = await uploadFileToCloudinary(image);
    }
    if (banner) {
      uploadedBanner = await uploadFileToCloudinary(banner);
    }
    const newInternationalDestination = new InternationalDestinations({
      name,
      startingPrice,
      image: uploadedImage[0],
      banner: uploadedBanner[0],
      packages,
    });
    await newInternationalDestination.save();

    res.status(201).json({
      success: true,
      message: "International Destination created successfully!",
      data: newInternationalDestination,
    });
  }
);

export const getInternationalDestination = asyncHandler(
  async (req, res, next) => {
    const findDestionations = await InternationalDestinations.find();

    if (findDestionations.length === 0) {
      return res.status(404).json({ message: "No Destinations Found" });
    }

    res.status(200).json({
      success: true,
      message: "Destinations fetched successfully",
      data: findDestionations,
    });
  }
);

export const getSingleInternationalDestination = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const findDestionation = await InternationalDestinations.findById(id);
    if (findDestionation == null) {
      return res.status(404).json({ message: "No Destination ith ID found" });
    }

    res.status(200).json({
      success: true,
      message: "Destionation found successfully",
      data: findDestionation,
    });
  }
);

export const updateInternationalDestination = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const updateDestination = await InternationalDestinations.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (updateDestination == null) {
      return res.status(404).json({ message: "No Destination with ID found" });
    }

    res.status(200).json({
      success: true,
      message: "Destionation updated successfully",
      data: updateDestination,
    });
  }
);

export const deleteInternationalDestination = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const deleteDestination = await InternationalDestinations.findByIdAndDelete(
      id
    );

    if (deleteDestination == null) {
      return res.status(404).json({ message: "No Destination with ID found" });
    }

    res.status(200).json({
      success: true,
      message: "Destionation deleted successfully",
      data: deleteDestination,
    });
  }
);
