import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteFile } from "../../utils/fileUtils.js";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHotel = asyncHandler(async (req, res, next) => {
  const { image } = req.files;
  let uploadedImage = null;
  // Save image locally
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    const targetPath = path.join(
      __dirname,
      "../../../public/" + uploadedImage.path
    );
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }
    fs.renameSync(image[0].filepath, targetPath);
  }

  const newHotel = await Hotel.create({
    ...req?.body,
    image: uploadedImage,
  });

  if (!newHotel) {
    return next(new ApiErrorResponse("Hotel creation failed", 400));
  }

  res.status(201).json({
    success: true,
    message: "Hotel created successfully",
    data: newHotel,
  });
});

// Get All Hotels
export const getAllHotels = asyncHandler(async (req, res, next) => {
  const findHotels = await Hotel.find();

  if (findHotels.length == 0) {
    return next(new ApiErrorResponse("No Hotels Found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Hotels Found Successfully",
    data: findHotels,
  });
});

//Get Hotel by Id
export const getHotelById = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params?.hotelId);
  if (!hotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Hotel found successfully", data: hotel });
});

//Delete Hotel By Id
export const deleteHotelById = asyncHandler(async (req, res, next) => {
  let deletedHotel = await Hotel.findByIdAndDelete(req.params?.hotelId);
  if (!deletedHotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }
  // Delete the image file from the server
  if (deletedHotel.image) {
    const imagePath = path.join(
      __dirname,
      "../../../public",
      deletedHotel.image.path
    );
    try {
      await deleteFile(imagePath); // Use the utility to delete the file
    } catch (error) {
      console.error("Error deleting hotel image:", error);
      return next(
        new ApiErrorResponse("Error deleting hotel image from server", 500)
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Hotel deleted successfully",
  });
});

const constructSearchQuery = (query) => {
  let constructedQuery = {};
  if (query.location) {
    constructedQuery.$or = [
      { "address.city": new RegExp(query.location, "i") }, //case-insensitive search
      { "address.country": new RegExp(query.location, "i") },
      { "address.state": new RegExp(query.location, "i") },
    ];
  }
  if (query.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(query.adultCount),
    };
  }

  if (query.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(query.childCount),
    };
  }
  if (query.numberOfRooms) {
    constructedQuery.numberOfRooms = {
      $gte: parseInt(query.numberOfRooms),
    };
  }
  if (query.pricePerNight) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(query.pricePerNight),
    };
  }

  return constructedQuery;
};

export const getHotelsByDestination = async (req, res) => {
  const { destinationId } = req.params;
  try {
    const hotels = await Hotel.find({
      destination: destinationId,
    });

    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found for this destination." });
    }

    res
      .status(200)
      .json({ success: true, message: "Hotels found", data: hotels });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
