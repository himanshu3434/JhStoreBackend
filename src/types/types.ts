import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface Iuser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  role: string;
  gender: string;
  password: string;
  address?: string;
  mobileNumber?: number;
  pincode?: string;
  country?: string;
  state?: string;
  dob: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): boolean;
  generateAccessTokens(): string;
  generateRefreshTokens(): string;
  age: number;
}
export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  stock: number;
  price: number;
  categoryName: string;
  coverPhoto: string;
  photo1: string;
  photo2: string;
  photo3: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CustomRequest extends Request {
  user?: Iuser;
}
export interface deletePhotoRequest extends Request {
  statusCodeLocal?: number;
  errorMessage?: string;
  success?: boolean;
}

export interface baseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $gte: number;
    $lte: number;
  };
  categoryName?: string;
}

export type filesMulter = { [fieldname: string]: Express.Multer.File[] };

export interface ICart extends Document {
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  quantity: number;
}
export interface ICartItem extends Document {
  _id: Types.ObjectId;
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  productDetails: {
    _id: Types.ObjectId;
    name: string;
    stock: number;
    price: number;
    categoryName: string;
    coverPhoto: string;
  };
  productTotalPrice: number;
}
