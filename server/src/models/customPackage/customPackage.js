import mongoose from "mongoose";

const customPackageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    numberOfTravellers: { type: Number, required: true },
    price: { type: Number, required: true },
    selectedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    }, // Leh
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    pickDropPoint: {
      pickup: { type: String, required: true },
      drop: { type: String, required: true },
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        date: { type: Date, required: true },
        selectedLocation: { type: String, required: true },
        selectedHotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hotel",
          required: true,
        },
        selectedActivities: [
          {
            label: { type: String, required: true },
            value: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Activity",
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const CustomPackage = mongoose.model("CustomPackage", customPackageSchema);

export default CustomPackage;
