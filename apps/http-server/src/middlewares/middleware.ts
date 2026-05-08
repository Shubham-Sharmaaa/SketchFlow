import { secret } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export interface AuthRequest extends Request {
  userId?: string;
}
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(404).json({ message: "please give token" });
    const decoded = jwt.verify(token, secret);

    if (!(decoded as JwtPayload).userId)
      return res.status(400).json({ message: "invalid token" });

    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (err) {
    res.status(500).json({ message: "invalid or expired token" });
  }
};
