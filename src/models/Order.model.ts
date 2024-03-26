import mongoose from "mongoose";
import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    transaction_id: {
      type: String,
      required: [true, "Transaction id is required"],
    },
    status: {
      type: String,
      enum: ["Processing", "Packed", "Shipped", "Delivered"],
      default: "Processing",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderAmount: {
      type: Number,
      required: [true, "Order Total is required"],
    },
    shippingCharge: {
      type: Number,
      required: [true, "Shipping Charge is Required"],
    },
    discount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
