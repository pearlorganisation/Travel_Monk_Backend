import mongoose from "mongoose";

const indianDestinationsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
      asset_id: { type: String },
    },
    startingPrice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const IndianDestinations = mongoose.model(
  "IndianDestinations",
  indianDestinationsSchema
);

export default IndianDestinations;
