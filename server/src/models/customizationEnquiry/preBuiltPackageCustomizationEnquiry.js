import mongoose from "mongoose";

const preBuiltPackageCustomizationEnquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    package: {
      name: String, // To show on mail
      packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    },
    numberOfTravellers: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true },
    selectedVehicle: {
      name: String, // To show on mail
      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    },
    itinerary: [
      {
        day: { type: Number },
        location: { type: String },
        date: { type: String },
        selectedHotel: {
          name: String,
          hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
          },
        },
        selectedActivities: [
          {
            label: { type: String },
            value: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Activity",
            },
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
    inclusions: [String], // no need for this these are attached with package
    exclusions: [String],
  },
  { timestamps: true }
);

const PreBuiltPackageCustomizationEnquiry = mongoose.model(
  "PreBuiltPackageCustomizationEnquiry",
  preBuiltPackageCustomizationEnquirySchema
);

export default PreBuiltPackageCustomizationEnquiry;
