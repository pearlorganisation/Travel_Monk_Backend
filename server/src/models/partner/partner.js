import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    partnerName: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
    },
    partnerType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PartnerType",
      required: [true, "Partner type is required"],
    },
    partnerLogo: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
