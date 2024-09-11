import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    itinerary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    pricing: {
      innova: {
        capacity: { type: Number, default: 5 },
        price: Number,
      },
      tempo: {
        capacity: { type: Number, default: 10 },
        price: Number,
      },
    },
    inclusions: [String],
    exclusions: [String],
    premiumAddons: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
