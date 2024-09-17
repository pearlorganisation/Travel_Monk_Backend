import mongoose from "mongoose";

const InternationalDestinationsSchema = new mongoose.Schema(
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
      type: String,
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

const InternationalDestinations = mongoose.model(
  "InternationalDestinations",
  InternationalDestinationsSchema
);

export default InternationalDestinations;
