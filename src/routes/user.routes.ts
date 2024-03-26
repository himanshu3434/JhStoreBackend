import { Router } from "express";
import {
  deleteUser,
  getCurrentUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateAddress,
  updateDob,
  updateEmail,
  updateGender,
  updateName,
  updateNumber,
  updatePassword,
  updateRole,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.post("/registerUser", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refreshAccessToken", verifyJWT, refreshAccessToken);
userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);

userRouter.post("/updateEmail", verifyJWT, updateEmail);
userRouter.post("/updatePassword", verifyJWT, updatePassword);
userRouter.post("/updateNumber", verifyJWT, updateNumber);
userRouter.post("/updateAddress", verifyJWT, updateAddress);
userRouter.post("/updateDob", verifyJWT, updateDob);
userRouter.post("/updateName", verifyJWT, updateName);
userRouter.post("/updateGender", verifyJWT, updateGender);
userRouter.post("/deleteUser", verifyJWT, deleteUser);
userRouter.post("/updateRole", verifyJWT, verifyAdmin, updateRole);

export { userRouter };
