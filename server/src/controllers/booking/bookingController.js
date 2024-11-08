import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { razorpayInstance } from "../../configs/razorpay/razorpay.js";
import crypto from "crypto";
import PreBuiltPackageBooking from "../../models/booking/preBuiltPackageBooking.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { totalPrice, user, packageId, numberOfTravellers } = req.body;

  // Basic validation
  if (!totalPrice) {
    return res
      .status(400)
      .json({ message: "Amount and currency are required" });
  }
  const options = {
    amount: totalPrice * 100, // Convert amount to smallest unit (paise for INR)
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(1000 + Math.random() * 9000)}`, // Generate unique receipt id
  };

  // Create the order using Razorpay instance
  try {
    const order = await razorpayInstance.orders.create(options);
    const preBuiltPackageBooking = await PreBuiltPackageBooking.create({
      bookingId: `BID_${Date.now()}`,
      user: "670f7d22de6dad830bd241e0",
      packageId: "670e521c1a925010284229bf",
      numberOfTravellers: 3,
      totalPrice,
      bookingStatus: "Pending",
      paymentStatus: "Unpaid",
      razorpay_order_id: order.id,
    });

    // Return success response with order details
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
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
    await PreBuiltPackageBooking.findOneAndUpdate(
      { razorpay_order_id },
      { paymentStatus: "Paid", bookingStatus: "Completed" }
    );
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});
