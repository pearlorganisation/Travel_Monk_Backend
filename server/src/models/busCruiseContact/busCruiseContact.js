import mongoose from "mongoose";

const busCruiseContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    type: {
      type: String,
      enum: ["Bus", "Cruise"],
      required: true,
    },
    startDestination: {
      type: String,
      required: true,
    },
    endDestination: {
      type: String,
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
      min: [1, "Number of seats must be at least 1"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const BusCruiseContact = mongoose.model(
  "BusCruiseContactSchema",
  busCruiseContactSchema
);

export default BusCruiseContact;
