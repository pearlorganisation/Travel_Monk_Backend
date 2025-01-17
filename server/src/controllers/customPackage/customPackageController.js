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
export const getCustomPackages = asyncHandler(async(req,res,next)=>{
  const packages = await CustomPackage.find().populate('user')
  if(!packages){
    return next(new ApiErrorResponse("Unable to get any custom packages",400));
  }
  res.status(201).json({success:true, message:"Packages recieved", data:packages})
})