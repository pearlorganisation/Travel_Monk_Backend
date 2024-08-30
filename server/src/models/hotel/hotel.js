import mongoose from "mongoose";

var hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: [true, "A hotel must have a location"],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    adultCount: {
      type: Number,
      required: true,
    },
    childCount: {
      type: Number,
      required: true,
    },
    facilities: [String],
    amenities: [String],
    images: [{}],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
