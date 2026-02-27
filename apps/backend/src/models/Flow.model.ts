import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlow {
  name: string;
  description?: string;
  status: "active" | "draft" | "inactive";
  ownerId: mongoose.Types.ObjectId;
  agent_id?: mongoose.Types.ObjectId;
  api_key?: string;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowDocument extends IFlow, Document {}

const FlowSchema = new Schema<FlowDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "draft", "inactive"],
      default: "draft",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agent_id: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    api_key: {
      type: String,
      default: () => `vx_${Math.random().toString(36).substring(2, 18)}`,
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "flows",
  },
);

FlowSchema.pre(/^find/, function (this: any, next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
  next();
});

export const Flow: Model<FlowDocument> =
  mongoose.models.Flow || mongoose.model<FlowDocument>("Flow", FlowSchema);
