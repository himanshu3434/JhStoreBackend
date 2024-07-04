import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/ordreItem.model.js";
import { CustomRequest, ICartItem } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUserOrders = asyncHandler(async (req: CustomRequest, res) => {});
const createOrder = asyncHandler(async (req: CustomRequest, res) => {
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
    console.log(
      " allCartItems",
      allCartItems,
      "discount",
      discount,
      "subTotal",
      subTotal,
      "transaction_id",
      transaction_id,
      "paymentMode",
      paymentMode
    );
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
    } catch (error) {
      console.log("error while creating orderItems", error);
    }

    return;
  });

  return res
    .status(201)
    .json(new apiResponse(true, 201, order, "Order Created"));
});

const cancelOrder = asyncHandler(async (req, res) => {});

//admin only
const getAllOrders = asyncHandler(async (req, res) => {});

const updateOrderStatus = asyncHandler(async (req, res) => {});

export { createOrder };
