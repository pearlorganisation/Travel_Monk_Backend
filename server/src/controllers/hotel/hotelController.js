import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";

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
      return next("Image files cannot be more than 5", 422); //422 Unprocessable Content
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
    images: uploadedImages.map((img) => img.url),
    ratingsAverage: Number(ratingsAverage),
    numberOfRatings: Number(numberOfRatings),
  });
  await newHotel.save();

  res
    .status(201)
    .json({ message: "Hotel created successfully!", data: newHotel });
});
