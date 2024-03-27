import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/all/:page", getAllProducts);

export { productRouter };
