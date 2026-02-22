import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLogDocument extends Document {
  actorId: mongoose.Types.ObjectId;
  action: string;
  targetId?: mongoose.Types.ObjectId;
  targetType?: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    targetType: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const ActivityLog = mongoose.model<IActivityLogDocument>(
  "ActivityLog",
  ActivityLogSchema,
);
