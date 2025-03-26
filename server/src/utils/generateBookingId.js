import { customAlphabet } from "nanoid";

const nanoidNumeric = customAlphabet("0123456789", 6); // Generates a 6-digit numeric ID

const generateBookingId = () => {
  const year = new Date().getFullYear();
  return `TM${year}${nanoidNumeric()}`;
};

export default generateBookingId;
