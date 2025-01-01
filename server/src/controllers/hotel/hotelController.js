import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteFile } from "../../utils/fileUtils.js";
import { paginate } from "../../utils/pagination.js";

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
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const { data: hotels, pagination } = await paginate(Hotel, page, limit);

  if (hotels.length === 0) {
    return next(new ApiErrorResponse("No Hotels Found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Hotels Found Successfully",
    pagination,
    data: hotels,
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

export const updateHotelById = asyncHandler(async (req, res, next) => {
  const { image } = req.files;

  // Fetch the hotel to check for existing images
  const existingHotel = await Hotel.findById(req.params.hotelId);
  if (!existingHotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }

  let uploadedImage;

  // Only upload images if they are provided
  if (image) {
    uploadedImage = {
      filename: image[0].newFilename,
      path: `uploads/${image[0].newFilename}`,
    };
    const targetPath = path.join(
      __dirname,
      "../../../public/" + uploadedImage.path
    );

    // Create the directory if it doesn't exist
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    // Move the new file to the target location
    fs.renameSync(image[0].filepath, targetPath);

    if (existingHotel.image) {
      // Delete the existing image from the server
      const filePath = path.join(
        __dirname,
        "../../../public",
        existingHotel.image.path
      );
      await deleteFile(filePath);
    }
  }

  // Update the hotel document
  const updatedHotel = await Hotel.findByIdAndUpdate(
    req.params.hotelId,
    {
      ...req.body,
      image: uploadedImage || existingHotel.image, // Retain the old image if no new image is provided
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedHotel) {
    return next(new ApiErrorResponse("Hotel not found or not updated", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Hotel updated successfully",
    data: updatedHotel,
  });
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

// Searching, filtering and sorting hotels
export const getHotelsByDestination = asyncHandler(async (req, res, next) => {
  const { destinationId } = req.params;
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const filter = { destination: destinationId }; // Initialize filter with destinationId so we get only data which belongs to this destination

  const { search, priceRange, minPrice, maxPrice } = req.query; // can select only one at a time priceRange or minPrice and maxPrice

  // Handle priceRange filter (if any priceRange is selected)
  if (priceRange) {
    //?priceRange=1000,2000&priceRange=3000
    const ranges = Array.isArray(priceRange) ? priceRange : [priceRange];
    const allPrices = ranges.flatMap((range) => range.split(",").map(Number));
    filter.estimatedPrice = {
      $gte: Math.min(...allPrices),
      $lte: Math.max(...allPrices),
    };
  }

  // Handle custom minPrice and maxPrice
  if (minPrice && maxPrice) {
    filter.estimatedPrice = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  }
  // console.log(JSON.stringify(filter, null, 2));
  // Handle search filter (if present)
  if (search) {
    // Price and search query can be slected together, if search query is present, and data is filtered by search query, if pirce filter also present, then data is filtered by both search query and price filter
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { state: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  // Sorting
  const sortField = {};
  switch (req.query.sortBy) {
    case "price-asc":
      sortField.estimatedPrice = 1;
      break;
    case "price-desc":
      sortField.estimatedPrice = -1;
      break;
  }
  console.log(JSON.stringify(filter, null, 2));
  // Use the pagination utility function
  const { data: hotels, pagination } = await paginate(
    Hotel,
    page,
    limit,
    [{ path: "destination", select: "name" }],
    filter,
    "",
    sortField
  );

  if (!hotels.length) {
    return next(
      new ApiErrorResponse("No hotels found for this destination.", 404)
    );
  }

  const allPrices = [];
  if (priceRange) {
    const ranges = Array.isArray(priceRange) ? priceRange : [priceRange];
    ranges.forEach((range) => {
      const [min, max] = range.split(",").map(Number);
      if (!isNaN(min)) allPrices.push(min);
      if (!isNaN(max)) allPrices.push(max);
    });
  }

  res.status(200).json({
    success: true,
    message: "Hotels found",
    pagination,
    data: hotels,
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
