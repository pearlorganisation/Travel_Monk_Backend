import mongoose from "mongoose";

const hotelContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfPersons: { type: Number, required: true, min: 1 },
    page: { type: String, required: true },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  { timestamps: true }
);

const HotelContact = mongoose.model("HotelContact", hotelContactSchema);

export default HotelContact;
