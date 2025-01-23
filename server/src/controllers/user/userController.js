import User from "../../models/user/user.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../../../constants.js";
import { paginate } from "../../utils/pagination.js";
import { generateForgotPasswordResetToken } from "../../utils/tokenHelper.js";
import { sendForgotPasswordMail } from "../../utils/Mail/emailTemplates.js";
import CustomPackage from "../../models/customPackage/customPackage.js";

//Controller for refreshing Access token
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const clientRefreshToken = req.cookies.refresh_token;
  //console.log(clientRefreshToken);
  if (!clientRefreshToken) {
    // If there's no refresh token, unauthorized request.
    return next(new ApiErrorResponse("Unauthorized Request", 401)); // Expired or Invalid Refresh Token. force the user to log out in front end and login again
  }

  try {
    const decoded = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || clientRefreshToken !== user.refreshToken) {
      // Token mismatch or user not found, clear the cookies
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(new ApiErrorResponse("Refresh token is expired", 401));
    }

    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken(); // User will be logged in for longer time

    user.refreshToken = refresh_token;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("access_token", access_token, {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      })
      .cookie("refresh_token", refresh_token, {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      })
      .json({ success: true, message: "Tokens refreshed successfully" });
  } catch (error) {
    // Catch JWT verification error and clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return next(new ApiErrorResponse("Invalid refresh token", 401));
  }
});

// Change password controller
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const { email } = req.user;
  if (!email) {
    return next(new ApiErrorResponse("Unauthorized User", 401));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiErrorResponse("User not found", 401));
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    return next(new ApiErrorResponse("Wrong password", 400));
  }

  if (newPassword === currentPassword) {
    return next(
      new ApiErrorResponse(
        "New password cannot be the same as the old password",
        400
      )
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ApiErrorResponse("New passwords do not match", 400));
  }

  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
});

//Forgot Password Controller
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiErrorResponse("Email is required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiErrorResponse("No user found!!", 400));
  const forgotPasswordResetToken = generateForgotPasswordResetToken({
    userId: existingUser._id,
    email,
  });
  await sendForgotPasswordMail(
    email,
    { forgotPasswordResetToken, existingUser },
    existingUser.role
  )
    .then(() => {
      return res.status(200).json({
        success: true,
        message: "Mail sent successfully.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: `Unable to send mail! ${error.message}`,
      });
    });
});

//Reset Password Controller
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  if (!password) {
    return next(new ApiErrorResponse("Password is required!", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return next(new ApiErrorResponse("Invalid token!", 400));
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ApiErrorResponse("User not found!", 401));
  }

  user.password = password;
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password reset successfully." });
});

//Get user details Contoller
export const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return next(new ApiErrorResponse("User is not found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "User found successfully", data: user });
});

export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  // Fetch the existing user details: Can change name and mobile number only
  let user = await User.findByIdAndUpdate(
    userId,
    { ...req.body },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  return res
    .status(200)
    .json({ success: true, message: "User updated successfully" });
});

// Get all Users with pagination
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const { search } = req.query;
  let filter = {
    _id: { $ne: req.user._id }, // Exclude the current user.
  };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Use the pagination utility function
  const { data: users, pagination } = await paginate(
    User,
    page,
    limit,
    [], // No population needed
    filter, // No filters
    "-password -refreshToken" // Fields to exclude
  );

  // Check if no users found
  if (!users || users.length === 0) {
    return next(new ApiErrorResponse("Users not found", 404));
  }

  // Return paginated response
  return res.status(200).json({
    success: true,
    message: "Users found successfully",
    pagination,
    data: users,
  });
});

export const getUsersCustomPackage = asyncHandler(async (req, res, next) => {
  let customPackage = await CustomPackage.find({ user: req.user._id });
  if (!customPackage) {
    return next(new ApiErrorResponse("Failded to get Custom Packages", 400));
  }
  res.status(200).json({
    success: true,
    message: customPackage.length
      ? "All Custom Packages found"
      : "No custom packages found",
    data: customPackage,
  });
});

export const createUser = asyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body?.email });
  if (existingUser) {
    return next(new ApiErrorResponse("User already exists", 400));
  }
  const user = await User.create(req.body);
  if (!user) {
    return next(new ApiErrorResponse("User is not created", 400));
  }
  // Manually remove the password field
  user.password = undefined;
  res
    .status(201)
    .json({ success: true, message: "User is created", data: user });
});
