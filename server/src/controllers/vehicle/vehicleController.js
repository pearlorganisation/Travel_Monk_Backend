import Vehicle from "../../models/Vehicle/Vehicle.js";
import { uploadFileToCloudinary } from "../../utils/cloudinary.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createVehicle = asyncHandler(async (req, res, next) => {
  const uploadedAmenities = [];
  //   console.log(req.body);

  // Handle amenities upload
  if (req.files?.amenities) {
    const amenitiesArray = Array.isArray(req.files.amenities)
      ? req.files.amenities
      : [req.files.amenities];

    const amenitiesNames = (() => {
      //[ 'a1', 'a2' ]
      try {
        return typeof req.body.amenitiesNames === "string"
          ? JSON.parse(req.body.amenitiesNames)
          : req.body.amenitiesNames || [];
      } catch (error) {
        console.warn("Invalid amenitiesNames format:", req.body.amenitiesNames);
        return [];
      }
    })();

    const uploadedIcons = await Promise.all(
      amenitiesArray.map(async (file, index) => {
        try {
          const uploaded = await uploadFileToCloudinary(file); // [{surl, pubid}]
          return {
            name: amenitiesNames[index] || `Amenity ${index + 1}`,
            icon: uploaded[0],
          };
        } catch (error) {
          console.error(
            `Error uploading amenity file at index ${index}:`,
            error
          );
          throw error;
        }
      })
    );
    console.log("UPL Icon", uploadedIcons);
    uploadedAmenities.push(...uploadedIcons);
    console.log("UPl AMni", uploadedAmenities);
  }

  // Prepare and save the vehicle data
  const newVehicleData = {
    ...req.body,
    amenities: uploadedAmenities,
  };

  const newVehicle = await Vehicle.create(newVehicleData);

  if (!newVehicle) {
    return next(new ApiErrorResponse("Vehicle is not created", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Vehicle is created",
    data: newVehicle,
  });
});
