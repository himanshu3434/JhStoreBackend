import { Router } from "express";
import { cudItemToCart, getCartItems } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", cudItemToCart);
cartRouter.get("/get/:user_id", getCartItems);

export { cartRouter };
