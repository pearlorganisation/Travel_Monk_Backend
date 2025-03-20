import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    slug: { type: String, unique: true, required: true, trim: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    estimatedPrice: { type: Number, required: true },
    amenities: [String], // Chips or multiselect
    inclusion: [String],
    googleMapsUrl: { type: String, required: true }, // Embeded link of google map location
    image: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
    isBest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
