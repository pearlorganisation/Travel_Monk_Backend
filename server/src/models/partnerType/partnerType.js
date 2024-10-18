import mongoose from "mongoose";

const partnerTypeSchema = new mongoose.Schema(
  {
    partnerTypeName: {
      type: String,
      required: [true, "Partner type name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const PartnerType = mongoose.model("PartnerType", partnerTypeSchema);

export default PartnerType;
