import { sendMail } from "./sendMail.js";

export const sendSignupMail = async (email, signUptoken) => {
  const subject = "Email Verification";
  // Dynamically set BASE_URL based on NODE_ENV
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASE_URL // Production URL
      : process.env.DEV_BASE_URL; // Development URL
  const emailVerificationLink = `${baseUrl}/api/v1/auth/verify-signup/${signUptoken}`;
  const templateName = "emailVerification";
  const data = { emailVerificationLink };

  return sendMail(email, subject, templateName, data);
};

export const sendForgotPasswordMail = async (email, payload, role) => {
  const subject = "Password reset request";
  const forgotPasswordResetLink =
    role === "ADMIN"
      ? `${process.env.ADMIN_RESET_PASSWORD_PAGE_URL}/${payload.forgotPasswordResetToken}`
      : `${process.env.FRONTEND_RESET_PASSWORD_PAGE_URL}/${payload.forgotPasswordResetToken}`;
  const templateName = "forgotPasswordEmail";
  const data = { forgotPasswordResetLink, user: payload.existingUser };

  return sendMail(email, subject, templateName, data);
};

export const sendBookingConfirmationMail = async (email, data) => {
  const subject = "Booking Confirmation";
  const templateName = "bookingConfirmation";
  return sendMail(email, subject, templateName, data);
};

export const sendPreBuiltPackageCustomizationEnquiryMail = async (
  email,
  data
) => {
  const subject = "Pre-Built Package Customization Enquiry";
  const templateName = "preBuiltPackageCustomizationEnquiry";
  return sendMail(email, subject, templateName, data);
};

export const sendFullyCustomizeEnquiryMail = async (email, data) => {
  const subject = "Fully Customization Enquiry";
  const templateName = "fullyCustomizationEnquiry";
  return sendMail(email, subject, templateName, data);
};

export const sendHotelEnquiryMail = async (email, data) => {
  const subject = "Hotel Enquiry";
  const templateName = "hotelEnquiry";
  return sendMail(email, subject, templateName, data);
};
