import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
