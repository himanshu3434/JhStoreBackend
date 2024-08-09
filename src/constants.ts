import { CookieOptions } from "express";

export const accessTokencookieOptions: CookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "none",
};
export const refreshTokencookieOptions: CookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "none",
};
