import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
