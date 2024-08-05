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
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const productRouter = Router();

productRouter.get("/all/:page", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/all/filter/:page", getProductsWithFilter);
//adming routes
productRouter.post(
  "/create",
  verifyJWT,
  verifyAdmin,
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
    { name: "photo3", maxCount: 1 },
  ]),

  createProduct,
  unlinkPhoto
);
//#: TODO add admin middleware after creating frontend
productRouter.post("/update/:id", verifyJWT, verifyAdmin, updateProductdetail);

productRouter.post(
  "/update/photo/:name",
  verifyJWT,
  verifyAdmin,
  singleUpload,
  updateProductPhotos
);

export { productRouter };
