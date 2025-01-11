import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    banner: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
    image: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
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
        hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }], // No need to be required as no use of this for now
        activities: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
          },
        ],
      },
    ],
    startingPrice: { type: Number, required: true },
    inclusions: { type: [String], required: true },
    exclusions: { type: [String], required: true },
    packageDestination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
