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
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
});

locationsSchema.index({ "location.coordinates": "2dsphere" });

const Location = mongoose.model("Location", locationsSchema);

export default Location;
