import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    // vehicleName: {
    //   type: String,
    //   // required: true,
    //   unique: true,
    // },
    // passengerCapacity: {
    //   type: Number,
    //   // required: true,
    // },
    // luggageCapacity: {
    //   type: Number,
    //   // required: true,
    // },
    // price: {
    //   type: Number,
    //   // required: true,
    // },
    // images: [
    //   {
    //     secure_url: { type: String },
    //     public_id: { type: String },
    //   },
    // ],
    amenities: [
      { name: String, icon: { secure_url: String, public_id: String } },
    ],
    // isAvailable: {
    //   type: Boolean,
    //   default: true, // Vehicles are available by default
    // },
  },

  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
