import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/login").post(loginUser);

export { userRouter };
