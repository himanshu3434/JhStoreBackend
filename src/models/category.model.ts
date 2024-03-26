import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is required"],
      unique: [true, "Category Name must be Unique"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
