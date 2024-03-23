import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface Iuser extends Document {
  _id: string;
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
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): boolean;
  generateAccessTokens(): string;
  generateRefreshTokens(): string;
}
