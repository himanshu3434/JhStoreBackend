import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";

export const AsyncHandler = (functionHandler: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(functionHandler(req, res, next)).catch((err) => next(err));
  };
};
