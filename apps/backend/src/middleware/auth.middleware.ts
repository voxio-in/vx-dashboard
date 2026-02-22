import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { catchAsync } from "../utils/catchAsync";

export interface AuthRequest extends Request {
  user?: any;
  cookies: any;
}

export const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive || user.deletedAt) {
      return res
        .status(401)
        .json({ success: false, message: "User not found or inactive" });
    }

    req.user = user;
    next();
  },
);
