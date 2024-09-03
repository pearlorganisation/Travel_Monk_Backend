import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";

// Search Hotels
// export const searchHotels = asyncHandler(async (req, res, next) => {
//   const query = constructSearchQuery(req.query);

//   const limit = req.query?.limit || 10;
//   const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
//   const skip = (pageNumber - 1) * limit;

//   const hotels = await Hotel.find(query).skip(skip).limit(limit);
//   const total = await Hotel.countDocuments(query);
//   if (!hotels || hotels.length === 0) {
//     return next(new ApiErrorResponse("Hotels not found", 404));
//   }
//   return res.status(200).json({
//     success: true,
//     message: "Hotels retrieved successfully",
//     data: hotels,
//     pagination: { total, page: pageNumber, pages: Math.ceil(total / limit) },
//   });
// });

export const searchHotels = asyncHandler(async (req, res, next) => {
  const query = constructSearchQuery(req.query);

  const limit = req.query?.limit || 10;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * limit;

  // Aggregation pipeline
  const hotels = await Hotel.aggregate([
    { $match: query }, // Match the query parameters
    { $unwind: "$roomTypes" }, // Deconstruct the roomTypes array
    { $match: { "roomTypes.availability": true } }, // Filter for available rooms
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        address: { $first: "$address" },
        description: { $first: "$description" },
        location: { $first: "$location" },
        roomTypes: { $addToSet: "$roomTypes" }, // Re-group roomTypes into an array
        numberOfRooms: { $first: "$numberOfRooms" },
        adultCount: { $first: "$adultCount" },
        childCount: { $first: "$childCount" },
        facilities: { $first: "$facilities" },
        amenities: { $first: "$amenities" },
        images: { $first: "$images" },
        banner: { $first: "$banner" },
        ratingsAverage: { $first: "$ratingsAverage" },
        numberOfRatings: { $first: "$numberOfRatings" },
        tag: { $first: "$tag" },
        discount: { $first: "$discount" },
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  // Get the total count for pagination
  const total = await Hotel.countDocuments(query);

  if (!hotels || hotels.length === 0) {
    return next(
      new ApiErrorResponse("Hotels with available rooms not found", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Hotels with available rooms retrieved successfully",
    data: hotels,
    pagination: { total, page: pageNumber, pages: Math.ceil(total / limit) },
  });
});

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
    numberOfRooms,
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
    !amenities ||
    !numberOfRooms
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
    numberOfRooms,
  });
  await newHotel.save();

  res.status(201).json({
    success: true,
    message: "Hotel created successfully!",
    data: newHotel,
  });
});

//Create Room Types
export const createRoomTypes = asyncHandler(async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
  }

  const { roomImages } = req.files;
  const uplodedImages = await uploadFileToCloudinary(roomImages);
  console.log(uplodedImages);
  hotel.roomTypes.push({
    ...req.body,
    roomImages: uplodedImages,
  });

  await hotel.save();
  return res.status(201).json({
    success: true,
    message: "Room type is created",
    data: hotel,
  });
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

const   constructSearchQuery = (query) => {
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
