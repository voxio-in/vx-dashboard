import { Response } from "express";
import { User } from "../models/User.model";
import { ActivityLog } from "../models/ActivityLog.model";
import { hashPassword } from "../utils/hash.utils";
import { canManageUser } from "../utils/hierarchy.utils";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";

export const getUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const users = await User.find({
    deletedAt: null,
    _id: { $ne: req.user._id },
  });
  res.status(200).json({ success: true, data: { users } });
});

export const createUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, role, parentId } = req.body;

    if (!canManageUser(req.user.role, role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Cannot create user with equal or higher role",
        });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      parentId,
    });

    await ActivityLog.create({
      actorId: req.user._id,
      action: "user:create",
      targetId: user._id,
      targetType: "User",
    });

    res.status(201).json({ success: true, data: { user } });
  },
);

export const updateUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Prevent role self-edit
    if (id === req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot edit your own account" });
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: { user } });
  },
);

export const deleteUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Soft delete
    await User.findByIdAndUpdate(id, { deletedAt: new Date() });

    await ActivityLog.create({
      actorId: req.user._id,
      action: "user:delete",
      targetId: id,
      targetType: "User",
    });

    res.status(200).json({ success: true, message: "User deleted" });
  },
);

export const toggleUserActivation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Cannot deactivate your own account",
        });
    }

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, data: { user } });
  },
);
