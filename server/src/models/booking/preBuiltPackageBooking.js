import mongoose from "mongoose";

// PreBuiltPackageBooking Schema
const preBuiltPackageBookingSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    numberOfTravellers: { type: Number, required: true },
    customizations: [
      {
        day: { type: Number, required: true },
        customizedHotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hotel",
          required: true,
        },
        customizedActivities: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Activity",
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
  },
  { timestamps: true }
);

// Create Model
const PreBuiltPackageBooking = mongoose.model(
  "PreBuiltPackageBooking",
  preBuiltPackageBookingSchema
);

export default PreBuiltPackageBooking;
