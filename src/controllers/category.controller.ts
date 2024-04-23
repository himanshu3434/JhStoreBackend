import { Category } from "../models/category.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId || categoryId.trim().length === 0)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Category Id is Required"));

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "This Category does not Exist"));

  return res
    .status(200)
    .json(
      new apiResponse(
        false,
        200,
        categoryExists,
        "Category Fetched SuccessFully"
      )
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

export { getCategory, addCategory };
