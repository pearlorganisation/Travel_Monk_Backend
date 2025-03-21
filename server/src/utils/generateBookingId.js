import crypto from "crypto";
import PreBuiltPackageBooking from "../models/booking/preBuiltPackageBooking.js";

const generateBookingId = async () => {
  const year = new Date().getFullYear();

  while (true) {
    // Generate a random 6-digit number
    const randomNum = crypto.randomInt(100000, 999999); // Ensures 6 digits
    const bookingId = `TM${year}${randomNum}`;

    // Check if the ID already exists in the database
    const existingBooking = await PreBuiltPackageBooking.findOne({ bookingId });
    if (!existingBooking) return bookingId; // Unique, so return it
  }
};

export default generateBookingId;
