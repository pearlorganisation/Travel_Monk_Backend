import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: true,
      unique: true,
    },
    passengerCapacity: {
      type: Number,
      required: true,
    },
    luggageCapacity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true, // Vehicles are available by default
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Destination model
        ref: "Destinations",
        required: true,
      },
    ],
  },

  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
