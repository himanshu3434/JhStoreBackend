import { Response } from "express";
import { deletePhotoRequest, filesMulter } from "../types/types.js";

import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";

export const unlinkPhoto = asyncHandler(
  async (req: deletePhotoRequest, res: Response) => {
    let localFilePathCoverPhoto = (req.files as filesMulter)?.coverPhoto?.[0]
      ?.path;
    let localFilePathPhoto1 = (req.files as filesMulter)?.photo1?.[0]?.path;
    let localFilePathPhoto2 = (req.files as filesMulter)?.photo2?.[0]?.path;
    let localFilePathPhoto3 = (req.files as filesMulter)?.photo3?.[0]?.path;

    if (localFilePathCoverPhoto) fs.unlinkSync(localFilePathCoverPhoto);
    if (localFilePathPhoto1) fs.unlinkSync(localFilePathPhoto1);
    if (localFilePathPhoto2) fs.unlinkSync(localFilePathPhoto2);
    if (localFilePathPhoto3) fs.unlinkSync(localFilePathPhoto3);
    const statusCode = req.statusCodeLocal as number;

    return res
      .status(statusCode)
      .json(new apiResponse(false, statusCode, null, req.errorMessage));
  }
);
