import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bus", "motorcycle"],
      default: "car",
    },
    destinations: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Destinations",
      },
    ],
    // indianDestinations: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "IndianDestinations",
    //   },
    // ],
    // internationalDestinations: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "InternationalDestinations",
    //   },
    // ],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
