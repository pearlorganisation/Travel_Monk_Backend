import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: true,
      // unique: true,
    },
    passengerCapacity: {
      type: Number,
      required: true,
    },
    luggageCapacity: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: [0, "Price per day must be positive"], // Ensures price is positive
    },
    image: {
      // can just put path here
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true, // Vehicles are available by default
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Destination model
        ref: "Destination",
        // required: true,
      },
    ],
  },

  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
