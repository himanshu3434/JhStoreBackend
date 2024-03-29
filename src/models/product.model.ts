import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types/types.js";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is Required"],
      unique: [true, "Product Name  should be unique"],
    },
    description: {
      type: String,
      required: [true, "Description of the product is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is Required"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price of Product is Required"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    coverPhoto: {
      type: String,
      required: [true, "Cover Photo is required"],
    },
    photo1: {
      type: String,
    },
    photo2: {
      type: String,
    },
    photo3: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
