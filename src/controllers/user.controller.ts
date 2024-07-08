import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest, Iuser } from "../types/types.js";
import { cookieOptions } from "../constants.js";

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
//#:TODO create only one controller for this
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
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

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
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

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
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

const updatePassword = asyncHandler(async (req: CustomRequest, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (
    [currentPassword, newPassword, confirmNewPassword].some(
      (field) => field.trim() === ""
    )
  ) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields Must Be Field"));
  }

  const user = await User.findById(req.user?._id);
  if (!user)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          "Internal Server Error Unable to fetch User Details"
        )
      );
  const checkPassword = await user?.isPasswordCorrect(currentPassword);
  if (!checkPassword) {
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "Current Password is Not Valid"));
  }

  if (newPassword === confirmNewPassword) {
    user.password = newPassword;
    await user?.save({ validateBeforeSave: false });
  } else
    return res
      .status(422)
      .json(
        new apiResponse(
          false,
          422,
          null,
          "NewPassword and ConfirmNewPassword does not match"
        )
      );

  return res
    .status(200)
    .json(new apiResponse(true, 200, {}, "Password Changed SuccessFully"));
});

const deleteUser = asyncHandler(async (req: CustomRequest, res) => {
  const { password } = req.body;

  if (!password) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "Password is Required"));
  }

  const user = await User.findById(req.user?._id);
  if (!user)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          "Internal Server Error Unable to fetch User Details"
        )
      );
  const checkPassword = await user?.isPasswordCorrect(password);
  if (!checkPassword) {
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, " Password is Not Valid"));
  }

  const deleteUser = await User.findByIdAndDelete(req.user?._id);

  if (!deleteUser)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal Server Error while Deleting the User"
        )
      );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new apiResponse(true, 200, null, "User deleted SuccessFully"));
});

const updateUserDetails = asyncHandler(async (req: CustomRequest, res) => {
  const {
    email,
    mobileNumber,
    address,
    pincode,
    country,
    state,
    dob,
    fullName,
    gender,
  } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "User Not Found "));
  if (email && email.trim().length != 0) {
    user.email = email;
  }
  // console.log("mobileNumber   ", typeof mobileNumber);
  if (mobileNumber) {
    user.mobileNumber = mobileNumber;
  }

  if (
    address &&
    pincode &&
    country &&
    state &&
    [address, pincode, country, state].some((field) => field?.trim() !== "")
  ) {
    user.address = address;
    user.pincode = pincode;
    user.country = country;
    user.state = state;
  }

  if (dob && dob.trim().length != 0) {
    user.dob = dob;
  }
  if (fullName && fullName.trim().length != 0) {
    user.fullName = fullName;
  }

  if (gender && gender.trim().length !== 0) {
    user.gender = gender;
  }

  const updatedUser = await user.save();
  updatedUser.password = "";
  updatedUser.refreshToken = "";
  return res
    .status(200)
    .json(
      new apiResponse(
        true,
        200,
        updatedUser,
        "User Details Updated SuccessFully"
      )
    );
});

//accessed only by admin
const updateRole = asyncHandler(async (req, res) => {
  const { role, userId } = req.body;

  if (!role || !userId)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "role or userId is Missing"));

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedUser)
    return res
      .status(401)
      .json(
        new apiResponse(
          false,
          401,
          null,
          "Either UserId is Invalid or Internal Server Error while Fetching the Request from the database"
        )
      );

  return res
    .status(200)
    .json(new apiResponse(true, 200, {}, "Role Updated SuccessFully"));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  updatePassword,
  deleteUser,
  updateRole,
  updateUserDetails,
};
