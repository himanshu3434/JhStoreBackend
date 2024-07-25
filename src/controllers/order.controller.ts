import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/ordreItem.model.js";
import { Product } from "../models/product.model.js";
import { CustomRequest, ICartItem } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUserOrders = asyncHandler(async (req: CustomRequest, res) => {
  const orders = await Order.find({ user_id: req.user?._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new apiResponse(true, 200, orders, "All  User Orders"));
});
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

const cancelOrder = asyncHandler(async (req, res) => {});

//admin only
const getAllOrders = asyncHandler(async (req, res) => {});

const updateOrderStatus = asyncHandler(async (req, res) => {});

export { createOrder, getAllUserOrders };
