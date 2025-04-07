import mongoose from "mongoose";

// FullyCustomizePackageEnquiryBooking Schema

const fullyCustomizePackageEnquiryBookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullyCustomizePackageEnquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FullyCustomizeEnquiry",
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

fullyCustomizePackageEnquiryBookingSchema.index({
  paymentStatus: "text",
});

const FullyCustomizePackageEnquiryBooking = mongoose.model(
  "FullyCustomizePackageEnquiryBooking",
  fullyCustomizePackageEnquiryBookingSchema
);

export default FullyCustomizePackageEnquiryBooking;
