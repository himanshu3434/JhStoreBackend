import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

//necessary middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

console.log(process.env.PORT);
import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { couponRouter } from "./routes/coupon.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
//import { fakeProduct } from "./utils/fakeData.js";
//fakeProduct(50).then(() => console.log("dataadded"));
//import { fakeCategory } from "./utils/fakeData.js";
//fakeCategory(5).then(() => console.log("Done Fake Category"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/category", categoryRouter);
export { app };
