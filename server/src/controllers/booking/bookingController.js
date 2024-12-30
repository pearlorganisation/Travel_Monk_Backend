import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { razorpayInstance } from "../../configs/razorpay/razorpay.js";
import crypto from "crypto";
import { nanoid } from "nanoid";
import PreBuiltPackageBooking from "../../models/booking/preBuiltPackageBooking.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { sendBookingConfirmationMail } from "../../utils/Mail/emailTemplates.js";
import { paginate } from "../../utils/pagination.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { totalPrice, packageId, numberOfTravellers } = req.body;
  const options = {
    amount: totalPrice * 100, // Convert amount to smallest unit (paise for INR)
    currency: "INR",
    receipt: `order_rcptid_${nanoid(8)}${Date.now()}`, // Generate unique receipt id
  };

  // Create the order using Razorpay instance
  try {
    const order = await razorpayInstance.orders.create(options);
    const preBuiltPackageBooking = await PreBuiltPackageBooking.create({
      bookingId: `BID_${nanoid(8)}${Date.now()}`,
      user: req.user._id,
      packageId,
      numberOfTravellers,
      totalPrice,
      bookingStatus: "Pending",
      paymentStatus: "Unpaid",
      razorpay_order_id: order.id,
    });

    res.status(200).json({
      success: true,
      order,
      bookingId: preBuiltPackageBooking.bookingId,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
    return next(new ApiErrorResponse("Failed to create Razorpay order", 500));
  }
});

// Verify payment signature
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const booking = await PreBuiltPackageBooking.findOneAndUpdate(
      { razorpay_order_id },
      { paymentStatus: "Paid", bookingStatus: "Completed" },
      { new: true }
    )
      .populate("user", "email name")
      .populate("packageId", "name");

    if (booking) {
      await sendBookingConfirmationMail(
        booking.user?.email, // Recipient's email
        {
          name: booking.user.name,
          bookingId: booking.bookingId,
          packageName: booking.packageId.name,
          numberOfTravellers: booking.numberOfTravellers,
          totalPrice: booking.totalPrice,
        }
      )
        .then(() => {
          return res.status(200).json({
            success: true,
            message:
              "Mail sent successfully. Please check your email, including the spam or junk folder to verify your account",
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: `Unable to send mail: ${error.message}`,
          });
        });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export const preBuiltPackages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const { data: preBuiltPackageBookings, pagination } = await paginate(
    PreBuiltPackageBooking,
    page,
    limit,
    [
      { path: "user", select: "-password -refreshToken -role" },
      { path: "packageId" }, // Can choose what to select
    ]
  );

  if (!preBuiltPackageBookings || preBuiltPackageBookings.length === 0) {
    return next(
      new ApiErrorResponse("No pre built package bookings found", 400)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Pre built packages bookings found successfully",
    pagination,
    data: preBuiltPackageBookings,
  });
});

export const myBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const { data: preBuiltPackageBookings, pagination } = await paginate(
    PreBuiltPackageBooking,
    page,
    limit,
    [
      { path: "user", select: "-password -refreshToken -role" },
      { path: "packageId" }, // Can choose what to select
    ],
    { user: req.user._id }
  );
  if (!preBuiltPackageBookings || preBuiltPackageBookings.length === 0) {
    return next(
      new ApiErrorResponse("No pre buil package bookings found", 400)
    );
  }
  return res.status(200).json({
    success: true,
    message: "Pre built packages bookings found successfully",
    pagination,
    data: preBuiltPackageBookings,
  });
});
