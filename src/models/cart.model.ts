import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      required: [true, "product ID is Required"],
      ref: "Product",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "user ID is Required"],
      ref: "User",
    },
    quantity: {
      type: Number,

      default: 1,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
