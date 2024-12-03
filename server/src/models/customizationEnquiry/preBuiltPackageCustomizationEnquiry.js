import mongoose from "mongoose";

const preBuiltPackageCustomizationEnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    numberOfTravellers: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true },
    selectedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        location: { type: String, required: true },
        seletedHotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hotel",
          required: true,
        },
        seletedActivities: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
          },
        ],
      },
    ],
    message: { type: String, required: true },
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
  },
  { timestamps: true }
);

const PreBuiltPackageCustomizationEnquiry = mongoose.model(
  "PreBuiltPackageCustomizationEnquiry",
  preBuiltPackageCustomizationEnquirySchema
);

export default PreBuiltPackageCustomizationEnquiry;
