import mongoose from "mongoose";

const fullyCustomizableBookingSchema = new mongoose.Schema(
  {
    // bookingId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    numberOfTravellers: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, //Estimated price
    tripDetails: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      duration: {
        days: { type: Number, required: true },
        nights: { type: Number, required: true },
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
              type: mongoose.Schema.Types.ObjectId,
              ref: "Activity",
              required: true,
            },
          ],
        },
      ],
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
  },
  { timestamps: true }
);

const FullyCustomizableBooking = mongoose.model(
  "FullyCustomizableBooking",
  fullyCustomizableBookingSchema
);

export default FullyCustomizableBooking;
