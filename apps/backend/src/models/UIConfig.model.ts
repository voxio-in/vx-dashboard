import mongoose, { Schema, Document } from "mongoose";

export interface IUIConfigDocument extends Document {
  ownerId: mongoose.Types.ObjectId;
  ownerType: "user" | "role";
  hiddenComponents: string[];
  sidebarItems: any[];
}

const UIConfigSchema = new Schema<IUIConfigDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    ownerType: { type: String, enum: ["user", "role"] },
    hiddenComponents: [{ type: String }],
    sidebarItems: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true },
);

export const UIConfig = mongoose.model<IUIConfigDocument>(
  "UIConfig",
  UIConfigSchema,
);
