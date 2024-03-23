import { Response, NextFunction } from "express";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

import { CustomRequest } from "../types/types.js";
import { apiReponse } from "../utils/apiResponse.js";
export const verifyJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    res.status(404).json(new apiReponse(false, 404, null, "Token Not Found"));

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as jwt.JwtPayload;

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new apiError(401, "Invalid Access Token");

  req.user = user;

  next();
};
