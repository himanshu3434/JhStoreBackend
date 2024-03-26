import { CustomRequest } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (user?.role === "admin") {
      next();
    }

    return res
      .status(401)
      .json(
        new apiResponse(
          false,
          401,
          null,
          "Unauthorised  request (Only Admin is Allowed )"
        )
      );
  }
);