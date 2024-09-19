import mongoose from "mongoose";

const indianDestinationsSchema = new mongoose.Schema(
  {
    name: {
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
      required: true,
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
  },
  { timestamps: true }
);

const IndianDestinations = mongoose.model(
  "IndianDestinations",
  indianDestinationsSchema
);

export default IndianDestinations;
