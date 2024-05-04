import { Request, Response } from "express";
import { Cart } from "../models/cart.model.js";

import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

//for one item at a time
//cud means create update and delete
const cudItemToCart = asyncHandler(async (req: Request, res: Response) => {
  const { product_id, user_id, quantity } = req.body;

  if (
    !product_id ||
    !user_id ||
    !quantity ||
    user_id.trim().length === 0 ||
    product_id.trim().length === 0
  )
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields Are Required"));

  const existingProduct = await Cart.findOne({ product_id, user_id });
  let newCartItem;
  if (existingProduct) {
    existingProduct.quantity += Number(quantity);
    if (existingProduct.quantity === 0)
      await Cart.findByIdAndDelete(existingProduct._id);
    else await existingProduct.save();
  } else if (Number(quantity) >= 0) {
    newCartItem = await Cart.create({ product_id, user_id, quantity });
  }
  return Number(quantity) >= 0
    ? res
        .status(200)
        .json(
          new apiResponse(true, 200, null, "Item Added in Cart SuccessFully")
        )
    : res
        .status(200)
        .json(
          new apiResponse(
            true,
            200,
            null,
            "Item Deleted from Cart SuccessFully"
          )
        );
});
const getCartItems = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id || user_id.trim().length === 0)
    return res
      .status(200)
      .json(new apiResponse(false, 404, null, "User Id is required"));

  const cartDetails = await Cart.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "productArray",
        pipeline: [
          {
            $project: {
              price: 1,
              categoryName: 1,
              coverPhoto: 1,
              name: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        productDetails: { $arrayElemAt: ["$productArray", 0] },
      },
    },

    {
      $addFields: {
        productTotalPrice: {
          $multiply: ["$productDetails.price", "$quantity"],
        },
      },
    },

    {
      $project: {
        productArray: 0,
      },
    },
  ]);
  const subTotal = cartDetails.reduce(
    (accumulator, cartElement) =>
      accumulator + Number(cartElement.productTotalPrice),
    0
  );
  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { cartDetails, subTotal },
        "Cart Items Fetched SuccessFully"
      )
    );
});
const deleteItemFromCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
});
const deleteAllItemsFromCart = asyncHandler(async (req, res) => {});

//for adding all items a once
const addListOfItemsToCart = asyncHandler(async (req, res) => {});

export { cudItemToCart, getCartItems };
