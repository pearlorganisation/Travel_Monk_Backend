import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address.",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [
        /^\d{10,15}$/,
        "Please enter a valid phone number (10-15 digits).",
      ],
    },
    message: { type: String, required: true },
    page: { type: String, required: true }, // Contain the url of page where contact form had been submited
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
