import { Response } from "express";
import { GlobalConfig } from "../models/GlobalConfig.model";
import { UIConfig } from "../models/UIConfig.model";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMyConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const globalConfig = await GlobalConfig.findOne();
    const userConfig = await UIConfig.findOne({ ownerId: req.user._id });

    const roleOverrides =
      (globalConfig?.roleOverrides as Record<string, any>)?.[req.user.role] ||
      {};
    const globalHidden = globalConfig?.defaultUIConfig?.hiddenComponents || [];
    const roleHidden = roleOverrides?.hiddenComponents || [];
    const userHidden = userConfig?.hiddenComponents || [];

    const hiddenComponents = [
      ...new Set([...globalHidden, ...roleHidden, ...userHidden]),
    ];

    res.status(200).json({
      success: true,
      data: {
        hiddenComponents,
        sidebarItems: globalConfig?.defaultUIConfig?.sidebarItems || [],
      },
    });
  },
);
