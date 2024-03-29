import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { baseQuery, deletePhotoRequest, filesMulter } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUploadHandler } from "../utils/fileUpload.js";

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
//category filter is not checked yet check after creating frontend
const getProductsWithFilter = asyncHandler(async (req, res) => {
  console.log("here");
  const { search, price, sort, category } = req.body;
  const page = Number(req.params.page);
  const baseQuery: baseQuery = {};
  const limit = Number(process.env.PAGE_LIMIT);
  const skipSize = (page - 1) * limit;
  console.log("search  ", search);
  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };

  if (price)
    baseQuery.price = {
      $lte: Number(price),
    };
  //Category Filter  Is Not Checked
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
const createProduct = asyncHandler(
  async (req: deletePhotoRequest, res, next) => {
    const { name, description, stock, price, category_id } = req.body;

    //check if any field is empty

    if (
      [name, description, stock, price, category_id].some(
        (field) => field?.trim() === ""
      )
    ) {
      req.statusCodeLocal = Number(404);
      req.errorMessage = "All Fields Must Be Fields";
      req.success = false;
      next();
      return;
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      req.statusCodeLocal = Number(409);
      req.errorMessage = "Product with This name already Exist";
      req.success = false;
      next();
      return;
    }

    //console.log("here 1", req.files);
    const localFilePathCoverPhoto = (req.files as filesMulter)?.coverPhoto[0]
      ?.path;
    // console.log("here 2");
    if (!localFilePathCoverPhoto)
      return res
        .status(404)
        .json(new apiResponse(false, 404, null, "Cover photo is Required"));

    const coverPhoto = await fileUploadHandler(localFilePathCoverPhoto);

    if (!coverPhoto)
      return res
        .status(500)
        .json(
          new apiResponse(
            false,
            500,
            null,
            "Internal Server Error while Uploading the coverPhoto to Cloud"
          )
        );

    let localFilePathPhoto1,
      photo1,
      photo2,
      photo3,
      localFilePathPhoto2,
      localFilePathPhoto3;

    if (
      req.files &&
      Array.isArray((req.files as filesMulter).photo1) &&
      (req.files as filesMulter).photo1.length > 0
    ) {
      localFilePathPhoto1 = (req.files as filesMulter)?.photo1?.[0]?.path;
      photo1 = await fileUploadHandler(localFilePathPhoto1);
    }

    if (
      req.files &&
      Array.isArray((req.files as filesMulter).photo2) &&
      (req.files as filesMulter).photo2.length > 0
    ) {
      localFilePathPhoto2 = (req.files as filesMulter)?.photo2?.[0]?.path;
      photo2 = await fileUploadHandler(localFilePathPhoto2);
    }

    if (
      req.files &&
      Array.isArray((req.files as filesMulter).photo3) &&
      (req.files as filesMulter).photo3.length > 0
    ) {
      localFilePathPhoto3 = (req.files as filesMulter)?.photo3?.[0]?.path;
      photo3 = await fileUploadHandler(localFilePathPhoto3);
    }
    const product = await Product.create({
      name,
      description,
      stock,
      price,
      category_id,
      coverPhoto: coverPhoto.url,
      photo1: photo1?.url || "",
      photo2: photo2?.url || "",
      photo3: photo3?.url || "",
    });

    if (!product)
      return res
        .status(500)
        .json(
          new apiResponse(
            false,
            500,
            null,
            "Internal Server Error while Saving the Product to the DataBase"
          )
        );

    res
      .status(201)
      .json(
        new apiResponse(true, 200, product, "Product created SuccessFully")
      );
  }
);

const updateProductdetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, stock, price, description, category_id } = req.body;
  const product = await Product.findById(id);

  if (!product)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "User Not Found "));

  if (name) product.name = name;
  if (description) product.description = description;
  if (stock) product.stock = stock;
  if (price) product.price = price;
  if (category_id) product.category_id = category_id;

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new apiResponse(true, 200, product, "User Detail Updated SuccessFully")
    );
});

const updateProductCoverPhoto = asyncHandler(async (req, res) => {});

const updateProductPhotos = asyncHandler(async (req, res) => {
  const { photoNo } = req.body;
});
const deleteProduct = asyncHandler(async (req, res) => {});

export {
  getAllProducts,
  getProduct,
  getProductsWithFilter,
  createProduct,
  updateProductdetail,
};
