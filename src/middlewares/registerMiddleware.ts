import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../common/errors/not-auth";

export const registerAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) throw new NotAuthorizedError();

  next();
};
