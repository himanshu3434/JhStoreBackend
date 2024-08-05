import { Router } from "express";
import {
  addCategory,
  getCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/new", verifyJWT, verifyAdmin, addCategory);
categoryRouter.get("/get", verifyJWT, verifyAdmin, getCategory);

export { categoryRouter };
