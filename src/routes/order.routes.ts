import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getAllUserOrders,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create", verifyJWT, createOrder);
orderRouter.get("/allOrder", verifyJWT, getAllUserOrders);

export { orderRouter };
