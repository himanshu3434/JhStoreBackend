import { Router } from "express";
import {
  addCoupon,
  deleteCoupon,
  getCoupon,
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const couponRouter = Router();
//admin route add that later
couponRouter.post("/new", verifyJWT, verifyAdmin, addCoupon);
couponRouter.post("/delete", verifyJWT, verifyAdmin, deleteCoupon);
couponRouter.get("/check/:coupon", verifyJWT, getCoupon);

export { couponRouter };
