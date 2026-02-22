import { Response, NextFunction } from "express";
import { Role } from "@vx/shared";
import { isAtLeast } from "../utils/hierarchy.utils";
import { AuthRequest } from "./auth.middleware";

export const roleGuard = (requiredRole: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !isAtLeast(userRole, requiredRole)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
    }

    next();
  };
};
