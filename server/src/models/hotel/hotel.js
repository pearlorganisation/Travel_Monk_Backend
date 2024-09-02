import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [String],
    roomImages: [{}],
    availability: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
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
    roomTypes: [roomTypeSchema],
    numberOfRooms: {
      type: Number,
      min: 1,
    },
    adultCount: {
      type: Number,
      required: true,
      min: 1,
    },
    childCount: {
      type: Number,
      required: true,
      min: 1,
    },
    facilities: [String],
    amenities: [String],
    images: [{}],
    banner: {
      secure_url: { type: String },
      public_id: { type: String },
      asset_id: { type: String },
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    tag: [String],
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
