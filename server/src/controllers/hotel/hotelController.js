import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";

//Create Hotel
export const createHotels = asyncHandler(async (req, res, next) => {
  const {
    name,
    address,
    description,
    location,
    pricePerNight,
    adultCount,
    childCount,
    facilities,
    amenities,
    ratingsAverage,
    numberOfRatings,
  } = req.body;

  if (
    !name ||
    !address ||
    !description ||
    !location ||
    !pricePerNight ||
    !adultCount ||
    !childCount ||
    !facilities ||
    !amenities
  ) {
    return next(new ApiErrorResponse("All fields are required", 400));
  }

  const { images } = req.files;
  let uploadedImages = [];

  if (images) {
    if (images.length > 5) {
      return next(
        new ApiErrorResponse("Image files cannot be more than 5", 422)
      ); //422 Unprocessable Content
    }
    uploadedImages = await uploadFileToCloudinary(images);
  }

  const newHotel = new Hotel({
    name,
    address,
    description,
    location,
    pricePerNight: Number(pricePerNight),
    adultCount: Number(adultCount),
    childCount: Number(childCount),
    facilities,
    amenities,
    images: uploadedImages,
    ratingsAverage: Number(ratingsAverage),
    numberOfRatings: Number(numberOfRatings),
  });
  await newHotel.save();

  res
    .status(201)
    .json({ message: "Hotel created successfully!", data: newHotel });
});

//Get Hotel by Id
export const getHotelById = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params?.id);
  if (!hotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Hotel found successfully", data: hotel });
});

//Delete Hotel By Id
export const deleteHotelById = asyncHandler(async (req, res, next) => {
  let hotel = await Hotel.findByIdAndDelete(req.params?.id);
  if (!hotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Hotel deleted successfully",
  });
});
