import Hotel from "../../models/hotel/hotel.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";

//Search Hotels
export const searchHotels = asyncHandler(async (req, res, next) => {
  const query = constructSearchQuery(req.query);

  const limit = req.query?.limit || 10;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * limit;

  // Aggregation pipeline
  const hotels = await Hotel.aggregate([
    { $match: query }, // Match the query parameters
    { $unwind: "$roomTypes" }, // Deconstruct the roomTypes array | each doc will have an element of that array
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

// Create Hotel
export const createHotel = asyncHandler(async (req, res, next) => {
  const { banner, amenities } = req.files || {};
  const { amenitiesNames, ...hotelData } = req.body;

  // Upload banner image
  const uploadedBanner = banner ? await uploadFileToCloudinary(banner) : [];
  console.log("---------------", uploadedBanner);
  // Handle amenities upload
  const uploadedAmenities = [];
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
    const uploadedIcons = await Promise.all(
      amenitiesArray.map(async (file, index) => {
        const name = amenitiesNames[index] || `Amenity ${index + 1}`;
        const uploaded = await uploadFileToCloudinary(file);
        return { name, icon: uploaded[0] }; // Assuming uploadFileToCloudinary returns an array
      })
    );
    uploadedAmenities.push(...uploadedIcons);
  }
  console.log(uploadedAmenities);
  // Prepare hotel data
  const newHotelData = {
    ...hotelData,
    amenities: uploadedAmenities,
    banner: uploadedBanner ? uploadedBanner[0] : undefined, // undefiend will ignore the banner
  };

  // Save hotel to database
  const newHotel = await Hotel.create(newHotelData);
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
  let hotel = await Hotel.findByIdAndDelete(req.params?.hotelId);
  if (!hotel) {
    return next(new ApiErrorResponse("Hotel not found", 404));
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
  console.log("");
  try {
    const hotels = await Hotel.find({
      destination: destinationId,
    });

    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found for this destination." });
    }

    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
