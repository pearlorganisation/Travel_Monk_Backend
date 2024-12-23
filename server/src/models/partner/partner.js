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
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
