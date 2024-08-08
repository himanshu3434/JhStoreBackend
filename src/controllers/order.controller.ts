import { Request, Response } from "express";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/ordreItem.model.js";
import { Product } from "../models/product.model.js";
import { CustomRequest, ICartItem } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUserOrders = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const orders = await Order.find({ user_id: req.user?._id }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(new apiResponse(true, 200, orders, "All  User Orders"));
  }
);
const createOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { allCartItems, discount, subTotal, transaction_id, paymentMode } =
    req.body;

  if (
    !allCartItems ||
    allCartItems.length === 0 ||
    discount === undefined ||
    !subTotal ||
    !transaction_id ||
    !paymentMode
  ) {
    return res
      .status(400)
      .json(new apiResponse(false, 400, null, "All Field Are Required"));
  }

  const order = await Order.create({
    transaction_id,
    user_id: req.user?._id,
    orderAmount: subTotal - discount,
    discount,
    paymentMode,
  });

  await allCartItems.map(async (cartItem: ICartItem) => {
    try {
      const orderItem = await OrderItem.create({
        order_id: order._id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
      });

      const product = await Product.findById(cartItem.product_id);
      if (product) {
        product.stock -= cartItem.quantity;
        product.save();
      }
    } catch (error) {
      console.log("error while creating orderItems", error);
    }

    return;
  });

  await Cart.deleteMany({ user_id: req.user?._id });

  return res
    .status(201)
    .json(new apiResponse(true, 201, order, "Order Created"));
});

// const cancelOrder = asyncHandler(async (req, res) => {});

//admin only
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(process.env.PAGE_LIMIT);
  const page = parseInt(req.params.page);

  const OrdersDetails = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "userArray",
        pipeline: [
          {
            $project: {
              fullName: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        user: { $arrayElemAt: ["$userArray", 0] },
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "orderItemsArray",
        pipeline: [
          {
            $project: {
              quantity: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        user: { $arrayElemAt: ["$userArray", 0] },
      },
    },
    {
      $addFields: {
        quantity: { $sum: "$orderItemsArray.quantity" },
      },
    },
    {
      $addFields: {
        fullName: "$user.fullName",
      },
    },

    {
      $project: {
        userArray: 0,
        orderItemsArray: 0,
        user: 0,
      },
    },
  ])
    .skip((page - 1) * limit)
    .limit(limit);

  const totalOrderList = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "userArray",
        pipeline: [
          {
            $project: {
              fullName: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        user: { $arrayElemAt: ["$userArray", 0] },
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "orderItemsArray",
        pipeline: [
          {
            $project: {
              quantity: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        user: { $arrayElemAt: ["$userArray", 0] },
      },
    },
    {
      $addFields: {
        quantity: { $sum: "$orderItemsArray.quantity" },
      },
    },
    {
      $addFields: {
        fullName: "$user.fullName",
      },
    },

    {
      $project: {
        userArray: 0,
        orderItemsArray: 0,
        user: 0,
      },
    },
  ]);

  const totalPageNumber = Math.ceil(totalOrderList.length / limit);

  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        { OrdersDetails, totalPageNumber },
        "All Orders Details"
      )
    );
});

// const updateOrderStatus = asyncHandler(async (req, res) => {});

export { createOrder, getAllOrders, getAllUserOrders };
