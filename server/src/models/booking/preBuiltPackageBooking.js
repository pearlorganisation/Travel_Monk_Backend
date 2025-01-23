import mongoose from "mongoose";

// PreBuiltPackageBooking Schema
const preBuiltPackageBookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    numberOfTravellers: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Advanced_Paid", "Unpaid"],
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

// Create a text index on bookingId, bookingStatus, and paymentStatus
preBuiltPackageBookingSchema.index({
  // bookingId: "text",
  // bookingStatus: "text",
  paymentStatus: "text",
});
// Create Model
const PreBuiltPackageBooking = mongoose.model(
  "PreBuiltPackageBooking",
  preBuiltPackageBookingSchema
);

export default PreBuiltPackageBooking;
