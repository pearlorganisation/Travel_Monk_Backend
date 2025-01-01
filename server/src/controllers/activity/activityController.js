import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import Activity from "../../models/activity/activity.js";
import { paginate } from "../../utils/pagination.js";

export const createActivity = asyncHandler(async (req, res, next) => {
  const { name, destination } = req.body;

  if (!name || !destination)
    return next(new ApiErrorResponse("All fields are required", 400));

  const validDestination = isValidObjectId(destination);

  console.log(validDestination, "dest is vliad or not");

  if (!validDestination)
    return next(new ApiErrorResponse("Not a Valid Destination ID", 400));

  const newActivity = await Activity.create(req.body);

  if (!newActivity)
    return next(new ApiErrorResponse("Activity not created", 400));

  res
    .status(201)
    .json({ success: true, message: "New Activity created Successfully" });
});

export const getAllActivities = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: activities, pagination } = await paginate(
    Activity,
    page,
    limit,
    [{ path: "destination", select: "name" }]
  );

  // Check if no contacts are found
  if (!activities || activities.length === 0) {
    return next(new ApiErrorResponse("No Activities found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Activities fetched successfully",
    pagination,
    data: activities,
  });
});

export const getActivityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const getActivity = await Activity.findById(id);

  if (getActivity == null)
    return next(new ApiErrorResponse("No Activity with ID Found", 400));

  res.json({
    success: true,
    message: "Activty Fetched Successfully",
    data: getActivity,
  });
});

export const deleteActivityById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const deletedActivity = await Activity.findByIdAndDelete(id);

  if (!deletedActivity)
    return next(new ApiErrorResponse("Activity not found", 404));

  res.status(200).json({
    success: true,
    message: "Activity deleted successfully",
  });
});

export const updateActivityById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const isValidId = isValidObjectId(id);

  if (!isValidId)
    return next(new ApiErrorResponse("Not a valid MongoDB ID", 400));

  const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
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
  try {
    const activities = await Activity.find({
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
