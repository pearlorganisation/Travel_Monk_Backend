import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { razorpayInstance } from "../../configs/razorpay/razorpay.js";
import crypto from "crypto";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { amount, currency } = req.body;

  // Basic validation
  if (!amount || !currency) {
    return res
      .status(400)
      .json({ message: "Amount and currency are required" });
  }
  const options = {
    amount: amount * 100, // Convert amount to smallest unit (paise for INR)
    currency: currency,
    receipt: `order_rcptid_${Math.floor(1000 + Math.random() * 9000)}`, // Generate unique receipt id
  };

  // Create the order using Razorpay instance
  const order = await razorpayInstance.orders.create(options);

  // Return success response with order details
  res.status(200).json({
    success: true,
    order,
  });
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
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});
