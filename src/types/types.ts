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
  category_id: Types.ObjectId;
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

export interface baseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: {
    category: string;
  };
}
