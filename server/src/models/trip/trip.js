import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    indianDestinations: [
      {
        type: mongoose.Types.ObjectId,
        ref: "IndianDestinations",
        required: true,
      },
    ],
    internationalDestinations: [
      {
        type: mongoose.Types.ObjectId,
        ref: "InternationalDestinations",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
