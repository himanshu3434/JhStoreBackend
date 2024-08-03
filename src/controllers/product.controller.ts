import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { baseQuery, deletePhotoRequest, filesMulter } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileDeleteHandler, fileUploadHandler } from "../utils/fileUpload.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const limit = Number(process.env.PAGE_LIMIT);
  const page = parseInt(req.params.page);
  const allProducts = await Product.find()
    .limit(limit)
    .skip((page - 1) * limit);

  const totalProductList = await Product.find();

  const totalPageNumber = Math.ceil(totalProductList.length / limit);

  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { allProducts, totalPageNumber },
        "All Products in limit "
      )
    );
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
  //console.log("here");
  const { search, minPrice, maxPrice, sort, category, review } = req.body;
  // console.log("body  ", req.body);
  const page = Number(req.params.page);
  const baseQuery: baseQuery = {};
  const limit = Number(process.env.PAGE_LIMIT);
  const skipSize = (page - 1) * limit;
  // console.log("search  ", search);
  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };

  if (minPrice && maxPrice)
    baseQuery.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  //Category Filter  Is Not Checked
  if (category) {
    baseQuery.categoryName = category;
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
  const reviewData = {
    reviewNumber: 0,
    reviewAverageRating: 0,
  };
  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { limitedProductList, totalPageNumber, reviewData },
        "List of Product Fetched SuccessFully"
      )
    );
});
//admin only routes
const createProduct = asyncHandler(
  async (req: deletePhotoRequest, res, next) => {
    const { name, description, stock, price, categoryName } = req.body;

    //check if any field is empty

    if (
      [name, description, stock, price, categoryName].some(
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
    // console.log("body ", req.body);
    //console.log("here 1", req.files);
    const localFilePathCoverPhoto = (req.files as filesMulter)?.coverPhoto[0]
      ?.path;
    //console.log("cover photo ", localFilePathCoverPhoto);
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
      categoryName,
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
  const { name, stock, price, description, categoryName } = req.body;
  const product = await Product.findById(id);

  if (!product)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "User Not Found "));

  if (name) product.name = name;
  if (description) product.description = description;
  if (stock) product.stock = stock;
  if (price) product.price = price;
  if (categoryName) product.categoryName = categoryName;

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new apiResponse(true, 200, product, "User Detail Updated SuccessFully")
    );
});

const updateProductPhotos = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const photoName = req.params.name;
  const product = await Product.findById(productId);
  if (!product)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Product not found"));
  if (!photoName)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "photo name is required"));

  const photo = req.file;
  if (!photo)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Photo not found"));

  const photoUrl = await fileUploadHandler(photo.path);
  if (!photoUrl)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal server error while uploading the photo to the cloud"
        )
      );
  let updatedProduct;

  let previousPhotoUrl;
  switch (photoName) {
    case "photo1":
      previousPhotoUrl = product?.photo1;
      product.photo1 = photoUrl?.url;
      break;
    case "photo2":
      previousPhotoUrl = product?.photo2;
      product.photo2 = photoUrl?.url;

      break;
    case "photo3":
      previousPhotoUrl = product?.photo3;
      product.photo3 = photoUrl?.url;

      break;
    case "coverPhoto":
      previousPhotoUrl = product?.coverPhoto;
      product.coverPhoto = photoUrl?.url;

      break;
    default:
      return res
        .status(401)
        .json(new apiResponse(false, 401, null, "invalid Photo Name"));
  }

  const response = await fileDeleteHandler(previousPhotoUrl);
  //  console.log("delete response ", response);
  if (!response || response.result != "ok")
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal server error while deleting the previous photo from the cloud"
        )
      );

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(true, 200, product, "Photo updated SuccessFully"));
});
//this require a flag variable not really deleting product
const deleteProduct = asyncHandler(async (req, res) => {});

export {
  getAllProducts,
  getProduct,
  getProductsWithFilter,
  createProduct,
  updateProductdetail,
  updateProductPhotos,
};
