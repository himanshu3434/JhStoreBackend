import { Router } from "express";
import {
  addCategory,
  getCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/new", addCategory);
categoryRouter.get("/get", getCategory);

export { categoryRouter };
