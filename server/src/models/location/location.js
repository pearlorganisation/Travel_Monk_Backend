import mongoose from "mongoose";

const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: ([lng, lat]) =>
        Array.isArray([lng, lat]) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180,
      message:
        "Invalid coordinates: Latitude must be between -90 and 90, Longitude must be between -180 and 180.",
    },
  },
});

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: geoSchema, required: true },
});

const locationsSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  location: [locationSchema],
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
});

locationsSchema.index({ "location.coordinates": "2dsphere" });

const Location = mongoose.model("Location", locationsSchema);

export default Location;
