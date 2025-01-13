import User from "../../models/user/user.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { generateSignUpToken } from "../../utils/tokenHelper.js";
import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../../../constants.js";
import dotnev from "dotenv";
import { sendSignupMail } from "../../utils/Mail/emailTemplates.js";

dotnev.config();

//SignUp controller
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, mobileNumber, password } = req?.body;

  if (!name || !email || !mobileNumber || !password) {
    return next(new ApiErrorResponse("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new ApiErrorResponse("User already exists!", 400));

  const signUptoken = generateSignUpToken({
    name,
    email,
    mobileNumber,
    password,
  });

  sendSignupMail(email, signUptoken)
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

export const verifySignUpToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decodedToken) {
    return next(
      new ApiErrorResponse("Email is not verified or Invalid token", 400)
    );
  }

  const savedUser = await User.create(decodedToken);
  if (!savedUser) {
    return next(new ApiErrorResponse("User is not created", 400));
  }

  // Redirect the user to the login page after successful verification
  res.redirect(302, `${process.env.FRONTEND_LOGIN_PAGE_URL}`);
});

// Login controller
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) return next(new ApiErrorResponse("No user found!!", 400));

  const isValidPassword = await existingUser.isPasswordCorrect(password);

  if (!isValidPassword)
    return next(new ApiErrorResponse("Wrong password", 400));

  const access_token = existingUser.generateAccessToken();
  const refresh_token = existingUser.generateRefreshToken();

  existingUser.refreshToken = refresh_token;
  await existingUser.save({ validateBeforeSave: false });

  res
    .cookie("access_token", access_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    })
    .cookie("refresh_token", refresh_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json({ success: true, message: "Logged in successfully." });
});

//Logout controller
export const logout = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    // Check if user was found
    if (!user) {
      return next(new ApiErrorResponse("User not found", 404)); // Return 404 if no user found
    }

    res
      .cookie("access_token", "", { ...COOKIE_OPTIONS, maxAge: 0 })
      .cookie("refresh_token", "", { ...COOKIE_OPTIONS, maxAge: 0 })
      .status(200)
      .json({ success: true, message: "Logout successfully!" });
  } catch (error) {
    console.log(`Error in logout: ${error.message}`);
    return next(new ApiErrorResponse("Error in logout", 500));
  }
});
