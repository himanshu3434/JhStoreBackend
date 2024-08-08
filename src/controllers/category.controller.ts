import { Category } from "../models/category.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories)
    return res
      .status(404)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal Server Error While Fetching the category from the database"
        )
      );
  let categoryArray = categories.map((category) => category.name);

  return res
    .status(200)
    .json(
      new apiResponse(true, 200, categoryArray, "Category Fetched SuccessFully")
    );
});
//admin only
const addCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName || categoryName.trim().length === 0)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Category name  is Required"));

  const categoryExists = await Category.findOne({ name: categoryName });

  if (categoryExists)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Category Already Exists"));

  const newCategory = await Category.create({
    name: categoryName,
  });
  return res
    .status(200)
    .json(
      new apiResponse(false, 200, newCategory, "Category Created SuccessFully")
    );
});

//on top after app is completed
const deleteCategory = asyncHandler(async (req, res) => {});

export { addCategory, getCategory };
