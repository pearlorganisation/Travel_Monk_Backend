import mongoose from "mongoose";
const locationsSchema = new mongoose.Schema({
  day: {
    type: Number,
  },
  location: [String],
});

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String, // LEH
      required: [true, "Destination name required"],
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
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
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
    },
    locations: {
      type: [locationsSchema],
      required: [true, "Locations are required"],
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Destinations = mongoose.model("Destination", destinationSchema);

export default Destinations;
