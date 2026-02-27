import { Response } from "express";
import { Flow } from "../models/Flow.model";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";
import { ActivityLog } from "../models/ActivityLog.model";

export const getFlows = catchAsync(async (req: AuthRequest, res: Response) => {
  const flows = await Flow.find({ ownerId: req.user._id });
  res.status(200).json({ success: true, data: { flows } });
});

export const createFlow = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const flow = await Flow.create({
      name,
      description,
      ownerId: req.user._id,
    });

    await ActivityLog.create({
      actorId: req.user._id,
      action: "flow:create",
      targetId: flow._id,
      targetType: "Flow",
    });

    res.status(201).json({ success: true, data: { flow } });
  },
);

export const updateFlow = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const flow = await Flow.findOneAndUpdate(
      { _id: id, ownerId: req.user._id },
      req.body,
      { new: true },
    );
    if (!flow)
      return res
        .status(404)
        .json({ success: false, message: "Flow not found" });
    res.status(200).json({ success: true, data: { flow } });
  },
);

export const deleteFlow = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await Flow.findOneAndDelete({ _id: id, ownerId: req.user._id });

    await ActivityLog.create({
      actorId: req.user._id,
      action: "flow:delete",
      targetId: id,
      targetType: "Flow",
    });

    res.status(200).json({ success: true, message: "Flow deleted" });
  },
);
export const getFlowById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const flow = await Flow.findOne({ _id: id, ownerId: req.user._id });
    if (!flow)
      return res
        .status(404)
        .json({ success: false, message: "Flow not found" });
    res.status(200).json({ success: true, data: { flow } });
  },
);
