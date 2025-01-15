import mongoose from "mongoose";

const customPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    pickDropPoint: {
      pickup: { type: String, required: true },
      drop: { type: String, required: true },
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        location: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        // hotel: {},
        activities: {
          type: [String],
          required: true,
        },
      },
    ],
    price: { type: Number, required: true },
    inclusions: { type: [String], required: true },
    exclusions: { type: [String], required: true },
  },
  { timestamps: true }
);

const CustomPackage = mongoose.model("CustomPackage", customPackageSchema);

export default CustomPackage;
