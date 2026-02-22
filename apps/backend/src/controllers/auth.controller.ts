import { Response } from "express";
import { User } from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/hash.utils";
import { signToken, setHttpOnlyCookie } from "../utils/jwt.utils";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, deletedAt: null }).select(
    "+password",
  );
  if (!user || !(await comparePassword(password, user.password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ success: false, message: "Account is deactivated" });
  }

  const token = signToken(user._id.toString(), user.role);
  setHttpOnlyCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { user: { ...user.toObject(), password: undefined } },
  });
});

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});
