import mongoose from "mongoose";

const hotelContactSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    numberOfPersons: {
      type: Number,
      required: true,
      min: 1,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HotelContact = mongoose.model("HotelContact", hotelContactSchema);

export default HotelContact;
