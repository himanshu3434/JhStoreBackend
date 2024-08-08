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
    paymentMode: {
      type: String,
      enum: ["Cod", "Card"],
      required: [true, "Mode of Payment is required"],
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
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
