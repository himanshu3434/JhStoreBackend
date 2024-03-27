import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { baseQuery } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const limit = Number(process.env.PAGE_LIMIT);
  const page = parseInt(req.params.page);
  const allProducts = await Product.find()
    .limit(limit)
    .skip((page - 1) * limit);
  return res
    .status(200)
    .json(new apiResponse(true, 200, allProducts, "All Products in limit "));
});

const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product)
    return res
      .status(404)
      .json(
        new apiResponse(
          false,
          404,
          null,
          "The Request Product With the Given id is Not Found in DataBase"
        )
      );

  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        product,
        "The Product Detail Fetched SuccessFully "
      )
    );
});
const getProductsWithFilter = asyncHandler(async (req, res) => {
  const { search, price, sort, category } = req.body;
  const page = Number(req.params.page);
  const baseQuery: baseQuery = {};
  const limit = Number(process.env.PAGE_LIMIT);
  const skipSize = (page - 1) * limit;
  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };

  if (price)
    baseQuery.price = {
      $lte: Number(price),
    };
  if (category) {
    const categoryData = await Category.findById(category);
    baseQuery.category = {
      category: categoryData?.name as string,
    };
  }

  const productPromise = Product.find(baseQuery)
    .sort(sort && { price: sort === "asc" ? 1 : -1 })
    .limit(limit)
    .skip(skipSize);
  const allProductWithOutSort = Product.find(baseQuery);

  const [limitedProductList, totalProductList] = await Promise.all([
    productPromise,
    allProductWithOutSort,
  ]);

  const totalPageNumber = Math.ceil(totalProductList.length / limit);

  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { limitedProductList, totalPageNumber },
        "List of Product Fetched SuccessFully"
      )
    );
});
//admin only routes
const createProduct = asyncHandler(async (req, res) => {});

const updateProductdetail = asyncHandler(async (req, res) => {});

const updateProductCoverPhoto = asyncHandler(async (req, res) => {});

const updateProductPhotos = asyncHandler(async (req, res) => {
  const { photoNo } = req.body;
});
const deleteProduct = asyncHandler(async (req, res) => {});

export { getAllProducts };
