import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destinations" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    startingPrice: { type: Number },
    amenities: [
      // max 5
      {
        name: { type: String },
        icon: {
          secure_url: { type: String },
          public_id: { type: String },
        },
      },
    ],
    banner: { secure_url: { type: String }, public_id: { type: String } }, //change name to image | 1 image
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
