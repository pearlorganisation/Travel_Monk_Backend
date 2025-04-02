import mongoose from "mongoose";

// PreBuiltPackageEnquiryBooking Schema
const preBuiltPackageEnquiryBookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    preBuiltPackageEnquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreBuiltPackageCustomizationEnquiry",
      required: true,
    },
    advancedPayment: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Advance_Payment_Complete", "Completed", "Failed"],
      required: true,
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Advanced_Paid", "Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
  },
  { timestamps: true }
);

preBuiltPackageEnquiryBookingSchema.index({
  paymentStatus: "text",
});

const PreBuiltPackageEnquiryBooking = mongoose.model(
  "PreBuiltPackageEnquiryBooking",
  preBuiltPackageEnquiryBookingSchema
);
export default PreBuiltPackageEnquiryBooking;
