import CustomPackage from "../../models/customPackage/customPackage.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createCustomPackage = asyncHandler(async (req, res, next) => {
  console.log("the requested body is", req.body)
  const customPackage = await CustomPackage.create(req.body);
  if (!customPackage) {
    return next(new ApiErrorResponse("Custom Package is not created", 400));
  }
  res.status(201).json({ success: true, message: "Custom Package is created" });
});



/** to get the packages */
export const getCustomPackages = asyncHandler(async (req, res, next) => {
  const packages = await CustomPackage.find()
    .populate([{
        path: 'user',
        select: '-password'
      },
      {
        path: 'itinerary.selectedHotel'
      },
      {
        path: 'selectedVehicle'
      }
    ])
    .sort({
      createdAt: -1
    }); // Sort by most recently created

  if (!packages) {
    return next(new ApiErrorResponse("Unable to get any custom packages", 400));
  }

  res.status(201).json({
    success: true,
    message: "Packages received",
    data: packages,
  });
});



/**delete the custom package by id */
export const deleteCustomPackage = asyncHandler(async(req,res,next)=>{
  const packageDelete = await CustomPackage.findByIdAndDelete(req?.params?.id)
  if(!packageDelete){
    return next(new ApiErrorResponse("Failed to Delete the Package", 400))
  }
  res.status(201).json({success:true, message:"Deleted Successfully"})
})