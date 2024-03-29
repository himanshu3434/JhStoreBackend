import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductsWithFilter,
  updateProductdetail,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { unlinkPhoto } from "../middlewares/unlinkLocalPhoto.middleware.js";

const productRouter = Router();

productRouter.get("/all/:page", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/all/filter/:page", getProductsWithFilter);
productRouter.post(
  "/create",
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
    { name: "photo3", maxCount: 1 },
  ]),

  createProduct,
  unlinkPhoto
);

productRouter.post("/update/:id", updateProductdetail);

export { productRouter };
