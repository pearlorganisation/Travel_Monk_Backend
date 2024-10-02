import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import IndianActivity from "../../models/activity/indianActivity.js";

export const createIndianActivity = asyncHandler(async (req, res, next) => {
  const { name, destination } = req.body;

  if (!name || !destination)
    return next(new ApiErrorResponse("All fields are required", 400));

  const validDestination = isValidObjectId(destination);

  console.log(validDestination, "dest is vliad or not");

  if (!validDestination)
    return next(new ApiErrorResponse("Not a Valid Destination ID", 400));

  const newActivity = await IndianActivity.create(req.body);

  if (!newActivity)
    return next(new ApiErrorResponse("Activity not created", 400));

  res
    .status(201)
    .json({ success: true, message: " New Activity created Successfully" });
});

export const getAllIndianActivities = asyncHandler(async (req, res, next) => {
  const findAllActivities = await IndianActivity.find();

  if (findAllActivities.length === 0)
    return next(new ApiErrorResponse("No activities found", 404));
 
  res.status(200).json({
    success: true,
    message: "Activities fetched successfully",
    data: findAllActivities,
  });
});

export const getActivityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const getActivity = await IndianActivity.findById(id);

  if (getActivity == null)
    return next(new ApiErrorResponse("No Activity with ID Found", 400));

  res.json({
    success: true,
    message: "Activty Fetched Successfully",
    data: getActivity,
  });
});

export const deleteIndianActivityById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const deletedActivity = await IndianActivity.findByIdAndDelete(id);

  if (!deletedActivity)
    return next(new ApiErrorResponse("Activity not found", 404));

  res.status(200).json({
    success: true,
    message: "Activity deleted successfully",
  });
});

export const updateIndianActivityById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const updatedActivity = await IndianActivity.findByIdAndUpdate(id, req.body, {
    new: true, // returns the updated document
    runValidators: true, // ensures that validation runs on the update
  });

  if (!updatedActivity)
    return next(
      new ApiErrorResponse("Activity not found or update failed", 404)
    );

  res.status(200).json({
    success: true,
    message: "Activity updated successfully",
    data: updatedActivity,
  });
});

export const getActivitiesByDestination = async (req, res) => {
  const { destinationId } = req.params;
  console.log("");
  try {
    const activities = await IndianActivity.find({
      destination: destinationId,
    });

    if (activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No activities found for this destination." });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
