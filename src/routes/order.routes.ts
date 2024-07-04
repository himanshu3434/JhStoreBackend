import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create", verifyJWT, createOrder);

export { orderRouter };
