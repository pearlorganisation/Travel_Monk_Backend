import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true },
    pricePerNight: { type: Number, required: true }, // Price per night for the room
    dblRoomRate: {
      type: Number,
      required: true,
      default: 0, // Rate for double room
    },
    extraBedRate: {
      type: Number,
      default: 0, // Rate for an extra bed
    },
    noChildBedRate: {
      rate: {
        type: Number,
        default: 0, // Rate for children without a bed
      },
      minAge: {
        type: Number,
        default: 5, // Minimum age for this rate
      },
      maxAge: {
        type: Number,
        default: 11, // Maximum age for this rate
      },
    },
    mealPlan: {
      type: String,
      enum: ["Dinner & Breakfast", "Breakfast Only", "No Meals"], // Type of meal plan offered
      required: true,
    },
    amenities: [{ name: { type: String }, icon: { type: String } }], // Amenities available in the room
    roomImages: [
      {
        secure_url: { type: String },
        public_id: { type: String },
      },
    ],
    availability: { type: Boolean, required: true }, // Room availability
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      unique: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destinations",
    },
    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    description: {
      type: String,
      // required: true,
    },
    location: {
      // Google map Embeded link
      type: String,
      // required: true,
    },
    startingPrice: {
      type: Number,
    },
    roomTypes: [roomTypeSchema],
    numberOfRooms: {
      type: Number,
      min: 1,
    },
    adultCount: {
      type: Number,
      required: true,
      min: 1,
    },
    childCount: {
      type: Number,
      required: true,
      min: 1,
    },
    facilities: [String],
    amenities: [{ name: { type: String }, icon: { type: String } }],
    images: [
      {
        secure_url: { type: String },
        public_id: { type: String },
      },
    ],
    banner: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    averageRatings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    tags: [String],
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
