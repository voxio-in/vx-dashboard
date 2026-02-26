import { Response } from "express";
import { GlobalConfig } from "../models/GlobalConfig.model";
import { UIConfig } from "../models/UIConfig.model";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";

export const getGlobalConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create({
        defaultUIConfig: { hiddenComponents: [], sidebarItems: [] },
        roleOverrides: {},
      });
    }
    res.status(200).json({ success: true, data: { config } });
  },
);

export const updateGlobalConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    let config = await GlobalConfig.findOne();
    if (!config) {
      config = await GlobalConfig.create(req.body);
    } else {
      config = await GlobalConfig.findOneAndUpdate({}, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: { config } });
  },
);

export const updateRoleConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const role = req.params.role as string;
    const { hiddenComponents } = req.body;

    let config = await GlobalConfig.findOne();
    if (!config) {
      const roleOverrides: Record<string, any> = {};
      roleOverrides[role] = { hiddenComponents };
      config = await GlobalConfig.create({
        defaultUIConfig: { hiddenComponents: [], sidebarItems: [] },
        roleOverrides,
      });
    } else {
      const roleOverrides: Record<string, any> =
        (config.roleOverrides as Record<string, any>) || {};
      roleOverrides[role] = { hiddenComponents };
      config.set("roleOverrides", roleOverrides);
      await config.save();
    }

    res.status(200).json({ success: true, data: { config } });
  },
);

export const updateUserConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const { hiddenComponents } = req.body;

    const config = await UIConfig.findOneAndUpdate(
      { ownerId: userId },
      { hiddenComponents, ownerType: "user" },
      { new: true, upsert: true },
    );

    res.status(200).json({ success: true, data: { config } });
  },
);
