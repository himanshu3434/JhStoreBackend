import { Router } from "express";
import {
  cudItemToCart,
  getCartItems,
  getQuantityCartItem,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", cudItemToCart);
cartRouter.get("/get/:user_id", getCartItems);
cartRouter.get("/get/item/:user_id/:product_id", getQuantityCartItem);

export { cartRouter };
