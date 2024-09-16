import mongoose from "mongoose";

const InternationalDestinationsSchema = new mongoose.Schema(
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

const InternationalDestinations = mongoose.model(
  "InternationalDestinations",
  InternationalDestinationsSchema
);

export default InternationalDestinations;
