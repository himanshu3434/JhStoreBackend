import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Iuser } from "../types/types.js";

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      require: [true, "id is required"],
      unique: [true, " Id already exist"],
    },
    fullName: {
      type: String,
      trim: true,
      require: [true, "Full Name is Required"],
    },
    email: {
      type: String,
      require: [true, "Email Address is Required"],
      unique: [true, "This Email Address Already Exist"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      require: [true, "Role is Required"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      require: [true, "Gender is Required"],
    },
    password: {
      type: String,
      require: [true, "Password is Required"],
    },
    address: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
      enum: ["india"],
    },
    state: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //temp fix by if see other sol
  //   if (this.password == null || this.password == undefined) return next();
  if (this.password) this.password = await bcrypt.hash(this.password, 10);

  next();
});
//it is to check the password provide is correct or not
UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);

  //return response;
};

UserSchema.methods.generateAccessTokens = function () {
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  return jwt.sign({ _id: this._id }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

UserSchema.methods.generateRefreshTokens = function () {
  const secret: string = process.env.REFRESH_TOKEN_SECRET as string;
  return jwt.sign({ _id: this._id }, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model<Iuser>("User", UserSchema);
