import mongoose from "mongoose";

const customizableBookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    numberOfTravellers: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, // Total price calculated for the customized trip
    bookingStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },

    //====================================================== need to modify below data ==============================

    // Customization Fields
    tripDetails: {
      startDate: { type: Date, required: true }, // Start date of the trip
      endDate: { type: Date, required: true }, // End date of the trip
      duration: {
        days: { type: Number, required: true }, // Total number of days
        nights: { type: Number, required: true }, // Total number of nights
      },
      itinerary: [
        {
          day: { type: Number, required: true }, // Day number
          location: { type: String, required: true }, // Location for the day
          hotels: [
            {
              hotel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hotel",
                required: true,
              }, // Reference to the selected hotel
              checkIn: { type: Date, required: true }, // Check-in date
              checkOut: { type: Date, required: true }, // Check-out date
            },
          ],
          activities: [
            {
              activity: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Activity",
                required: true,
              }, // Reference to the selected activity
              time: { type: String, required: true }, // Time for the activity
              duration: { type: String }, // Duration of the activity
            },
          ],
        },
      ],
      inclusions: [String], // Inclusions for the trip (e.g., meals, transport)
      exclusions: [String], // Exclusions for the trip (e.g., optional activities)
    },
  },
  { timestamps: true }
);

const CustomizableBooking = mongoose.model(
  "CustomizableBooking",
  customizableBookingSchema
);

export default CustomizableBooking;
