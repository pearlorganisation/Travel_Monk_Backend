import mongoose from "mongoose";

const distinguishedStaysSchema = new mongoose.Schema({}, { timestamps: true });

const DistinguishedStays = mongoose.model(
  "DistinguishedStays",
  distinguishedStaysSchema
);

export default DistinguishedStays;
