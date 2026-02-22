import mongoose, { Schema, Document } from "mongoose";

export interface IFlowDocument extends Document {
  name: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FlowSchema = new Schema<IFlowDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Flow = mongoose.model<IFlowDocument>("Flow", FlowSchema);
