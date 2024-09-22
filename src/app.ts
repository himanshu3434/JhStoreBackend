import express, { Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
const app = express();
dotenv.config();
//necessary middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "GET", "PUT", "DELETE"],

    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
export const stripe = new Stripe(stripeSecret);
console.log(process.env.PORT);

import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { couponRouter } from "./routes/coupon.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { orderRouter } from "./routes/order.routes.js";
//import { fakeProduct } from "./utils/fakeData.js";
//fakeProduct(50).then(() => console.log("dataadded"));
//import { fakeCategory } from "./utils/fakeData.js";
//fakeCategory(5).then(() => console.log("Done Fake Category"));
app.use("/api/v1/test", (req: Request, res: Response) => {
  return res.send("Welcome to JH Store API");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/order", orderRouter);

setInterval(async () => {
  console.log(" calling ping ");
  try {
    const response = await fetch(process.env.PING_URL || "");
    const data = await response.text();
    console.log("response  ", data);
  } catch (e) {
    console.log("error in ping ", e);
  }
}, 840000);
export { app };
