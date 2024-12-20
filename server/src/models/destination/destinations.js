import mongoose from "mongoose";
const locationsSchema = new mongoose.Schema({
  day: {
    type: Number,
  },
  location: [
    {
      name: String,
      coordinates: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true },
      },
    },
  ],
});
// Add geospatial index to the `coordinates` field
locationsSchema.index({ "location.coordinates": "2dsphere" });

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    banner: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
    },
    locations: {
      type: [locationsSchema],
      // required: [true, "Locations are required"],
    },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Destinations = mongoose.model("Destination", destinationSchema);

export default Destinations;
