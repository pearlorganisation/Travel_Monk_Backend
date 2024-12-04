import mongoose from "mongoose";

const fullyCustomizeEnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    numberOfTravellers: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true }, //Estimated price
    selectedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    destinationName: { type: String, required: true }, // Leh
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        date: { type: Date, required: true },
        selectedLocation: { type: String, required: true },
        selectedHotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hotel",
          required: true,
        },
        selectedActivities: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
          },
        ],
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    mobileNumber: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const FullyCustomizeEnquiry = mongoose.model(
  "FullyCustomizeEnquiry",
  fullyCustomizeEnquirySchema
);

export default FullyCustomizeEnquiry;