import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
