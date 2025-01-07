import User from "../../models/user/user.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { COOKIE_OPTIONS } from "../../../constants.js";
import { paginate } from "../../utils/pagination.js";
import { generateForgotPasswordResetToken } from "../../utils/tokenHelper.js";
import { sendForgotPasswordMail } from "../../utils/Mail/emailTemplates.js";

//Controller for refreshing Access token
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const clientRefreshToken = req.cookies.refresh_token;
  if (!clientRefreshToken) {
    return next(new ApiErrorResponse("Unauthorized Request", 401));
  }

  const decoded = jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decoded) {
    return next(new ApiErrorResponse("Invalid refresh token", 401));
  }

  const user = await User.findById(decoded._id);
  if (!user || clientRefreshToken !== user.refreshToken) {
    return next(new ApiErrorResponse("Refresh token is expired", 401));
  }

  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();

  user.refreshToken = refresh_token;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("access_token", access_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1day set to 15 min later
    })
    .cookie("refresh_token", refresh_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15day
    })
    .json({ access_token, refresh_token });
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
    forgotPasswordResetToken,
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

// Get all Users with pagination
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: users, pagination } = await paginate(
    User,
    page,
    limit,
    [], // No population needed
    { _id: { $ne: req.user._id } }, // No filters
    "-password -refreshToken -role" // Fields to exclude
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
