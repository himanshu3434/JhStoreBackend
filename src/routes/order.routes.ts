import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getAllOrders,
  getAllUserOrders,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create", verifyJWT, createOrder);
orderRouter.get("/allOrder", verifyJWT, getAllUserOrders);
//admin routes

orderRouter.get("/allOrderAdmin/:page", getAllOrders);

export { orderRouter };
