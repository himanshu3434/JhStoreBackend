import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    title: {
      type: String,
      required: [true, "Title of the review is required"],
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Rating  is Required"],
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", ReviewSchema);
