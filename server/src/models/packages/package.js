import mongoose from "mongoose";

// Destination Schema
const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

// Itinerary Day Schema
const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  description: String,
  destinations: [destinationSchema],
  activities: [activitySchema],
});

// Package Schema
const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    itinerary: [itineraryDaySchema],
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
