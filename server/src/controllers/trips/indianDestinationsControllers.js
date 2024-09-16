import IndianDestinations from "../../models/trip/indian_destinations.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createIndianDestination = asyncHandler(async (req, res, next) => {
  const { name, startingPrice } = req.body;
  if (!name || !startingPrice) {
    return next(new ApiErrorResponse("All fields are required", 400));
  }

  const { image } = req.files;
  let uploadedImage = [];

  if (image) {
    uploadedImage = await uploadFileToCloudinary(image);
  }
  const newIndianDestination = new IndianDestinations({
    name,
    startingPrice,
    image: uploadedImage[0],
  });
  await newIndianDestination.save();

  res.status(201).json({
    success: true,
    message: "Indian Destination created successfully!",
    data: newIndianDestination,
  });
});
