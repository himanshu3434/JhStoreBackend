import { Router } from "express";
import {
  addCoupon,
  deleteCoupon,
  getCoupon,
} from "../controllers/coupon.controller.js";

const couponRouter = Router();
//admin route add that later
couponRouter.post("/new", addCoupon);
couponRouter.post("/delete", deleteCoupon);
couponRouter.get("/check/:coupon", getCoupon);

export { couponRouter };
