import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductsWithFilter,
  updateProductPhotos,
  updateProductdetail,
} from "../controllers/product.controller.js";
import { singleUpload, upload } from "../middlewares/multer.middleware.js";
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
//adming routes
//#: TODO add admin middleware after creating frontend
productRouter.post("/update/:id", updateProductdetail);

productRouter.post("/update/photo/:name", singleUpload, updateProductPhotos);

export { productRouter };
