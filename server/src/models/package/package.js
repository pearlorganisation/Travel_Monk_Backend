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
    duration: { days: { type: Number }, nights: { type: Number } },
    pickDropPoint: { pickup: { type: String }, drop: { type: String } },
    itinerary: [
      {
        day: { type: Number, required: true },
        location: { type: String },
        title: { type: String },
        description: { type: String, required: true },
        hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
        activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
      },
    ],
    startingPrice: { type: Number, required: true },
    inclusions: [String],
    exclusions: [String],
    packageDestination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
