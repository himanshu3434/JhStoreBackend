import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/types.js";

const generateAccessAndRefreshTokesn = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  //console.log(user);
  const accessToken = user?.generateAccessTokens();
  const refreshToken = user?.generateRefreshTokens();
  if (user) {
    user.refreshToken = refreshToken || "";
    await user.save({ validateBeforeSave: false });
  }

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, gender, dob } = req.body;

  //check if any field is empty

  if (
    [fullName, email, password, gender].some((field) => field?.trim() === "") ||
    !dob
  ) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields Are Required"));
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser)
    return res
      .status(409)
      .json(
        new apiResponse(false, 409, null, "User with This email Already exist")
      );

  const user = await User.create({
    fullName,
    email,
    gender,
    dob,
    password,
  });

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!newUser)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal Server Error While Registering the User "
        )
      );
  res
    .status(201)
    .json(new apiResponse(true, 200, newUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || [password].some((field) => field.trim() === "")) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields are Required"));
  }

  const user = await User.findOne({
    email,
  });

  if (!user)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "User Not Found"));

  const passwordValid = await user.isPasswordCorrect(password);
  // console.log("password ", passwordValid);
  if (!passwordValid)
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "Unauthorised User"));
  //  console.log(passwordValid);
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokesn(
    user._id
  );
  const finalUser = await User.findById(user._id).select(
    "-password  -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        true,
        200,
        { user: finalUser, accessToken, refreshToken },
        "User Logged In SuccessFully"
      )
    );
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Refresh Token Not Found "));

  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;
  const user = await User.findById(decodedRefreshToken._id);

  if (!user)
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "Invalid Refresh Token"));
  if (incomingRefreshToken !== user.refreshToken)
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "Refresh Token Used or Expired"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokesn(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        true,
        200,
        { accessToken: accessToken, refreshToken: refreshToken },
        "Tokens Refreshed SuccessFully"
      )
    );
});
const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
  const user = req.user;

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new apiResponse(
        true,
        200,
        { loggedOut: true },
        "User logged Out SuccessFully"
      )
    );
});
const getCurrentUser = asyncHandler(async (req: CustomRequest, res) => {
  res
    .status(200)
    .json(new apiResponse(true, 200, { user: req.user }, "User Data"));
});

const updatePassword = asyncHandler(async (req, res) => {});

const updateEmail = asyncHandler(async (req, res) => {});

const updateNumber = asyncHandler(async (req, res) => {});

const updateAddress = asyncHandler(async (req, res) => {});

const updateDob = asyncHandler(async (req, res) => {});
const updateName = asyncHandler(async (req, res) => {});
const updateGender = asyncHandler(async (req, res) => {});
//accessed only by admin
const updateRole = asyncHandler(async (req, res) => {});
export { registerUser, loginUser };
