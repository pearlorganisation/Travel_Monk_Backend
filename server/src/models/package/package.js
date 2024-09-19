import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    // destination: { type: String, required: true },
    banner: {
      secure_url: { type: String },
      public_id: { type: String },
      asset_id: { type: String },
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
      asset_id: { type: String },
    },
    duration: {
      days: { type: Number },
      nights: { type: Number },
    },
    pickDropPoint: {
      pickup: { type: String },
      drop: { type: String },
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        description: { type: String, required: true },
      },
    ],
    startingPrice: {
      type: Number,
      required: true,
    },
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
