import mongoose from "mongoose";

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
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
    image: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
    },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Destinations = mongoose.model("Destination", destinationSchema);

export default Destinations;
