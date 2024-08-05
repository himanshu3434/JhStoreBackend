import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
  updateRole,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.post("/registerUser", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refreshAccessToken", verifyJWT, refreshAccessToken);
userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);
userRouter.post("/logout", verifyJWT, logoutUser);

userRouter.post("/updatePassword", verifyJWT, updatePassword);

userRouter.post("/updateDetails", verifyJWT, updateUserDetails);
userRouter.post("/delete", verifyJWT, deleteUser);
//admin routes
userRouter.post("/updateRole", verifyJWT, verifyAdmin, updateRole);
userRouter.get("/allUser/:page", verifyJWT, verifyAdmin, getAllUsers);

export { userRouter };
