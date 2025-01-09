import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    amenities: [String], // Chips or multiselect
    googleMapsUrl: { type: String, required: true }, // Embeded link of google map location
    image: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
